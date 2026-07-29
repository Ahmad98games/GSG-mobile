import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { usePersona } from '../../../src/hooks/usePersona';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { NspService } from '../../../src/services/NspService';
import { queueManager } from '../../../src/services/OfflineQueueManager';
import { LucideCheck, LucideChevronDown, LucideChevronUp, LucideInfo } from 'lucide-react-native';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';

const ShiftHandoverScreen = () => {
  const { t } = usePersona();
  const { connectionState } = useBridgeStatus();
  const isOffline = connectionState !== 'connected';

  const [shift, setShift] = useState<'morning' | 'evening' | 'night'>('morning');
  const [units, setUnits] = useState('0');
  const [machinesDown, setMachinesDown] = useState(false);
  const [machinesNote, setMachinesNote] = useState('');
  const [materialShortage, setMaterialShortage] = useState(false);
  const [materialNote, setMaterialNote] = useState('');
  const [qualityIssues, setQualityIssues] = useState(false);
  const [qualityNote, setQualityNote] = useState('');
  const [nextShiftNote, setNextShiftNote] = useState('');
  const [attendance, setAttendance] = useState({ present: '0', absent: '0', overtime: '0' });

  useEffect(() => {
    // Attempt to auto-populate units produced today
    const fetchTodayProduction = async () => {
      try {
        const res = await NspService.send({
          production_summary_req: {
            node_id: 'MOBILE_CLIENT',
            date: new Date().toISOString().split('T')[0]
          }
        });
        if (res?.production_summary_res?.total_units) {
          setUnits(res.production_summary_res.total_units.toString());
        }
      } catch (e) {
        console.log('[Handover] Auto-populate failed, using manual input');
      }
    };
    fetchTodayProduction();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      shift_handover_submit: {
        shift_id: shift,
        units_produced: parseInt(units) || 0,
        machines_down: machinesDown,
        machines_note: machinesNote,
        material_shortage: materialShortage,
        material_note: materialNote,
        quality_issues: qualityIssues,
        quality_note: qualityNote,
        next_shift_note: nextShiftNote,
        attendance_present: parseInt(attendance.present) || 0,
        attendance_absent: parseInt(attendance.absent) || 0,
        attendance_overtime: parseInt(attendance.overtime) || 0,
        timestamp: Date.now()
      }
    };

    // Write to sync_queue (OfflineQueueManager handles SQLite)
    await queueManager.enqueueNspEvent(payload);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert(t('handover.success_msg') || 'Handover submitted successfully. It will sync when connected.');
    // In a real app, we'd navigate back
  };

  const ShiftButton = ({ id, label }: { id: typeof shift, label: string }) => (
    <TouchableOpacity 
      style={[styles.shiftButton, shift === id && styles.shiftButtonActive]}
      onPress={() => {
        setShift(id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }}
    >
      <Text style={[styles.shiftButtonText, shift === id && styles.shiftButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const ToggleSection = ({ label, value, onToggle, note, onNoteChange }: any) => (
    <View style={styles.section}>
      <TouchableOpacity 
        style={styles.toggleRow} 
        onPress={() => {
          onToggle(!value);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.toggleLabel}>{label}</Text>
        <View style={[styles.toggleBox, value && styles.toggleBoxActive]}>
          {value && <LucideCheck size={16} color="#fff" />}
        </View>
      </TouchableOpacity>
      {value && (
        <TextInput
          style={styles.textArea}
          placeholder={t('handover.specify_placeholder') || "Provide details..."}
          placeholderTextColor="#6b7280"
          value={note}
          onChangeText={onNoteChange}
          multiline
        />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false, title: t('handover.title') || 'Shift Handover', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
      <ScreenHeader title="handover.title" showBack={true} />

      {isOffline && (
        <View style={styles.offlineBanner}>
          <LucideInfo size={16} color="#000" />
          <Text style={styles.offlineText}>
            {t('handover.offline_msg') || 'Working offline — handover will sync when connected'}
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Shift Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('handover.select_shift') || 'Shift'}</Text>
          <View style={styles.shiftContainer}>
            <ShiftButton id="morning" label={t('shift.morning') || "Morning"} />
            <ShiftButton id="evening" label={t('shift.evening') || "Evening"} />
            <ShiftButton id="night" label={t('shift.night') || "Night"} />
          </View>
        </View>

        {/* Section 2: Production Today */}
        <View style={styles.sectionCenter}>
          <Text style={styles.label}>{t('handover.units_produced') || 'Units Produced Today'}</Text>
          <TextInput
            style={styles.giantInput}
            value={units}
            onChangeText={setUnits}
            keyboardType="numeric"
            selectTextOnFocus
          />
        </View>

        {/* Section 3: Status Toggles */}
        <ToggleSection 
          label={t('handover.machines_down') || "Any machines down?"} 
          value={machinesDown} 
          onToggle={setMachinesDown} 
          note={machinesNote} 
          onNoteChange={setMachinesNote} 
        />
        <ToggleSection 
          label={t('handover.material_shortage') || "Material shortage?"} 
          value={materialShortage} 
          onToggle={setMaterialShortage} 
          note={materialNote} 
          onNoteChange={setMaterialNote} 
        />
        <ToggleSection 
          label={t('handover.quality_issues') || "Quality issues?"} 
          value={qualityIssues} 
          onToggle={setQualityIssues} 
          note={qualityNote} 
          onNoteChange={setQualityNote} 
        />

        {/* Section 4: Next Shift Note */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('handover.next_shift_note') || 'Instructions for next shift'}</Text>
          <TextInput
            style={[styles.textArea, { height: 100 }]}
            placeholder={t('handover.instructions_placeholder') || "Enter instructions..."}
            placeholderTextColor="#6b7280"
            value={nextShiftNote}
            onChangeText={(text) => text.length <= 300 && setNextShiftNote(text)}
            multiline
            maxLength={300}
          />
          <Text style={styles.charCounter}>{nextShiftNote.length}/300</Text>
        </View>

        {/* Section 5: Attendance */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('handover.attendance') || 'Attendance'}</Text>
          <View style={styles.attendanceRow}>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceLabel}>{t('attendance.present') || 'Present'}</Text>
              <TextInput 
                style={styles.attendanceInput} 
                value={attendance.present} 
                onChangeText={(v) => setAttendance({...attendance, present: v})} 
                keyboardType="numeric"
              />
            </View>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceLabel}>{t('attendance.absent') || 'Absent'}</Text>
              <TextInput 
                style={styles.attendanceInput} 
                value={attendance.absent} 
                onChangeText={(v) => setAttendance({...attendance, absent: v})} 
                keyboardType="numeric"
              />
            </View>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceLabel}>{t('attendance.overtime') || 'OT'}</Text>
              <TextInput 
                style={styles.attendanceInput} 
                value={attendance.overtime} 
                onChangeText={(v) => setAttendance({...attendance, overtime: v})} 
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{t('handover.submit') || 'Submit Handover'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  offlineBanner: {
    backgroundColor: '#fbbf24',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  offlineText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionCenter: {
    alignItems: 'center',
    marginBottom: 32,
  },
  label: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  shiftContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  shiftButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  shiftButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#60a5fa',
  },
  shiftButtonText: {
    color: '#9ca3af',
    fontSize: 15,
    fontWeight: 'bold',
  },
  shiftButtonTextActive: {
    color: '#fff',
  },
  giantInput: {
    color: '#fff',
    fontSize: 64,
    fontFamily: 'JetBrainsMono_700Bold',
    textAlign: 'center',
    width: '100%',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleLabel: {
    color: '#fff',
    fontSize: 16,
  },
  toggleBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4b5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBoxActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  textArea: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#374151',
    textAlignVertical: 'top',
  },
  charCounter: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  attendanceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  attendanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  attendanceLabel: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 8,
  },
  attendanceInput: {
    width: '100%',
    height: 56,
    backgroundColor: '#111827',
    borderRadius: 12,
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShiftHandoverScreen;
