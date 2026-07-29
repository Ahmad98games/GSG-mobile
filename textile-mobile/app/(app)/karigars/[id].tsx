'use client'
import React, { useState, useEffect,
  useCallback } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useLocalSearchParams, router }
  from 'expo-router'
import * as Haptics from 'expo-haptics'
import { supabase }
  from '@/lib/supabase'
import { useBridgeStatusStore }
  from '@/stores/BridgeStatusStore'
import { useIndustryConfig }
  from '@/hooks/useIndustryConfig'
import { ScreenContainer }
  from '@/components/ui/ScreenContainer'
import { ScreenHeader }
  from '@/components/navigation/ScreenHeader'
import { SkeletonRow }
  from '@/components/ui/SkeletonRow'

export default function KarigarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const {
    businessId, currency,
    canGivePeshgi, canViewFinancials,
  } = useBridgeStatusStore()
  const { t, features, fmt } =
    useIndustryConfig()

  const [karigar, setKarigar] =
    useState<any>(null)
  const [attendance, setAttendance] =
    useState<any[]>([])
  const [production, setProduction] =
    useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!businessId || !id) return
    setLoading(true)

    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 86400000
    ).toISOString().split('T')[0]

    const [karigarRes, attendanceRes,
      productionRes] = await Promise.all([
      supabase
        .from('karigars')
        .select('*')
        .eq('id', id)
        .single(),

      supabase
        .from('attendance_logs')
        .select('attendance_date, status')
        .eq('business_id', businessId)
        .eq('karigar_id', id)
        .gte('attendance_date', thirtyDaysAgo)
        .order('attendance_date', {
          ascending: false
        })
        .limit(30),

      supabase
        .from('karigar_production_logs')
        .select('log_date, units_produced, grade, earnings')
        .eq('business_id', businessId)
        .eq('karigar_id', id)
        .gte('log_date', thirtyDaysAgo)
        .order('log_date', { ascending: false })
        .limit(30),
    ])

    setKarigar(karigarRes.data)
    setAttendance(attendanceRes.data || [])
    setProduction(productionRes.data || [])
    setLoading(false)
  }, [businessId, id])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <ScreenContainer>
      <ScreenHeader
        title="Worker Details"
        showBack
      />
      <SkeletonRow lines={6} height={56} />
    </ScreenContainer>
  )

  if (!karigar) return (
    <ScreenContainer>
      <ScreenHeader
        title="Not Found"
        showBack
      />
    </ScreenContainer>
  )

  const thisMonthProduction = production.reduce(
    (s, p) => s + (p.units_produced || 0), 0
  )
  const thisMonthEarnings = production.reduce(
    (s, p) => s + (p.earnings || 0), 0
  )
  const presentDays = attendance.filter(
    a => a.status === 'present'
  ).length
  const rejectedCount = production.filter(
    p => p.grade === 'Rejected'
  ).length
  const rejectionRate = production.length > 0
    ? Math.round(
        rejectedCount / production.length * 100
      )
    : 0

  const STAT_COLOR = {
    present: '#10B981',
    absent: '#EF4444',
    half: '#F59E0B',
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title={karigar.name}
        subtitle={karigar.karigar_code}
        showBack
        rightAction={
          canGivePeshgi && features.peshgiAdvances
            ? {
                label: `Give ${t.advance}`,
                onPress: () => router.push(
                  `/(app)/karigars/peshgi?id=${id}&name=${karigar.name}`
                ),
                color: '#C5A059',
              }
            : undefined
        }
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {karigar.name.charAt(0)
                .toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {karigar.name}
            </Text>
            <Text style={styles.profileCode}>
              {karigar.karigar_code}
            </Text>
            {karigar.phone && (
              <Text style={styles.profilePhone}>
                {karigar.phone}
              </Text>
            )}
          </View>
          <View style={[
            styles.statusBadge,
            {
              backgroundColor:
                karigar.status === 'active'
                  ? 'rgba(16,185,129,0.15)'
                  : 'rgba(239,68,68,0.15)',
              borderColor:
                karigar.status === 'active'
                  ? 'rgba(16,185,129,0.4)'
                  : 'rgba(239,68,68,0.4)',
            }
          ]}>
            <Text style={[
              styles.statusText,
              {
                color: karigar.status === 'active'
                  ? '#10B981' : '#EF4444'
              }
            ]}>
              {karigar.status?.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Wage info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Wage Details
          </Text>
          <View style={styles.statGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>
                Type
              </Text>
              <Text style={styles.statValue}>
                {karigar.wage_type === 'piece_rate'
                  ? 'Piece Rate'
                  : karigar.wage_type === 'daily'
                  ? 'Daily Wage'
                  : 'Monthly'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>
                Rate
              </Text>
              <Text style={styles.statValue}>
                {karigar.wage_type === 'piece_rate'
                  ? fmt(karigar.piece_rate || 0)
                  : karigar.wage_type === 'daily'
                  ? fmt(karigar.daily_rate || 0)
                  : fmt(karigar.monthly_salary || 0)}
              </Text>
            </View>
            {features.peshgiAdvances && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>
                  {t.advance} Balance
                </Text>
                <Text style={[
                  styles.statValue,
                  karigar.peshgi_balance > 0 && {
                    color: '#C5A059'
                  }
                ]}>
                  {fmt(karigar.peshgi_balance || 0)}
                </Text>
              </View>
            )}
            {karigar.grade && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>
                  {t.qualityGrade}
                </Text>
                <Text style={styles.statValue}>
                  {karigar.grade}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* This month stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Last 30 Days
          </Text>
          <View style={styles.statGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>
                Days Present
              </Text>
              <Text style={[
                styles.statValue,
                { color: '#10B981' }
              ]}>
                {presentDays}
              </Text>
            </View>
            {features.pieceRateWages && (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>
                    Units Produced
                  </Text>
                  <Text style={[
                    styles.statValue,
                    { color: '#60A5FA' }
                  ]}>
                    {thisMonthProduction
                      .toLocaleString('en-PK')}
                  </Text>
                </View>
                {canViewFinancials && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>
                      Earnings
                    </Text>
                    <Text style={[
                      styles.statValue,
                      { color: '#10B981' }
                    ]}>
                      {fmt(thisMonthEarnings)}
                    </Text>
                  </View>
                )}
              </>
            )}
            {rejectionRate > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>
                  Rejection Rate
                </Text>
                <Text style={[
                  styles.statValue,
                  {
                    color: rejectionRate > 10
                      ? '#EF4444' : '#F59E0B'
                  }
                ]}>
                  {rejectionRate}%
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Recent attendance */}
        {attendance.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Recent Attendance
            </Text>
            <View style={styles.attendanceGrid}>
              {attendance.slice(0, 14).map(a => (
                <View
                  key={a.attendance_date}
                  style={[
                    styles.attendanceChip,
                    {
                      backgroundColor:
                        (STAT_COLOR[
                          a.status as keyof typeof STAT_COLOR
                        ] || '#374151') + '20',
                    }
                  ]}
                >
                  <View style={[
                    styles.attendanceChipDot,
                    {
                      backgroundColor:
                        STAT_COLOR[
                          a.status as keyof typeof STAT_COLOR
                        ] || '#374151',
                    }
                  ]} />
                  <Text style={styles.attendanceDate}>
                    {new Date(a.attendance_date)
                      .toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short'
                      })}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              Haptics.impactAsync(
                Haptics.ImpactFeedbackStyle.Light
              )
              router.push(
                `/(app)/production/quick-log?karigarId=${id}&karigarName=${karigar.name}&pieceRate=${karigar.piece_rate || 0}`
              )
            }}
          >
            <Text style={styles.actionBtnText}>
              ⚡ Log {t.production}
            </Text>
          </TouchableOpacity>

          {canGivePeshgi &&
            features.peshgiAdvances && (
            <TouchableOpacity
              style={[styles.actionBtn,
                styles.actionBtnSecondary]}
              onPress={() => {
                Haptics.impactAsync(
                  Haptics.ImpactFeedbackStyle.Light
                )
                router.push(
                  `/(app)/karigars/peshgi?id=${id}&name=${karigar.name}`
                )
              }}
            >
              <Text style={[
                styles.actionBtnText,
                { color: '#C5A059' }
              ]}>
                💰 Give {t.advance}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#0F1114',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(96,165,250,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileInitial: {
    fontSize: 22,
    fontWeight: '800',
    color: '#60A5FA',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileCode: {
    fontSize: 11,
    color: '#4B5563',
    fontFamily: 'monospace',
  },
  profilePhone: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#0F1114',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    minWidth: '45%',
    gap: 3,
  },
  statLabel: {
    fontSize: 10,
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  attendanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  attendanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  attendanceChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  attendanceDate: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#60A5FA',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    backgroundColor: 'rgba(197,160,89,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.3)',
  },
  actionBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
})
