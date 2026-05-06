import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';

const GOLD = '#C6A756';

export function PhotoEvidence({ onCapture, onClose }: { onCapture: (uri: string) => void, onClose: () => void }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      if (result) {
        // Module 11: Compress to <500KB
        const manipResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [{ resize: { width: 1024 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        setPhoto(manipResult.uri);
      }
    }
  };

  if (photo) {
    return (
      <View style={styles.preview}>
        <Image 
          source={{ uri: photo }} 
          style={StyleSheet.absoluteFillObject} 
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        <View style={styles.controls}>
          <TouchableOpacity style={styles.btn} onPress={() => setPhoto(null)}>
            <Text style={styles.btnText}>RETAKE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.primary]} onPress={() => onCapture(photo)}>
            <Text style={[styles.btnText, { color: '#000' }]}>ACCEPT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Ionicons name="close" size={32} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shutter} onPress={takePhoto}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>
        <Text style={styles.hint}>CAPTURE CLEAR EVIDENCE OF COMPLETED SUITS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 40, alignItems: 'center' },
  close: { alignSelf: 'flex-start' },
  shutter: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  shutterInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: GOLD },
  hint: { color: GOLD, fontSize: 10, fontWeight: '900', letterSpacing: 2, textAlign: 'center' },
  
  preview: { flex: 1, backgroundColor: '#000' },
  controls: { position: 'absolute', bottom: 60, flexDirection: 'row', gap: 24, alignSelf: 'center' },
  btn: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, backgroundColor: 'rgba(17,17,17,0.8)', borderWidth: 1, borderColor: '#1F1F1F' },
  primary: { backgroundColor: GOLD },
  btnText: { color: '#FFF', fontWeight: '900', fontSize: 12, letterSpacing: 2 },
});
