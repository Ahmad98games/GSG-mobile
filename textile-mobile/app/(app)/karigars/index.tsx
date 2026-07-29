'use client'
import React, { useState, useCallback,
  useEffect, memo }
  from 'react'
import {
  View, Text, StyleSheet,
  FlatList, TextInput, TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { router } from 'expo-router'
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
import { EmptyState }
  from '@/components/ui/EmptyState'
import { SkeletonRow }
  from '@/components/ui/SkeletonRow'

interface Karigar {
  id: string
  karigar_code: string
  name: string
  phone: string | null
  wage_type: 'piece_rate' | 'daily' | 'monthly'
  piece_rate: number | null
  daily_rate: number | null
  monthly_salary: number | null
  peshgi_balance: number
  status: string
  grade: string | null
  today_status?: 'present' | 'absent' | 'half' | null
  today_units?: number
}

// Memoized row component for performance
const KarigarRow = memo(function KarigarRow({
  karigar,
  onPress,
  currency,
}: {
  karigar: Karigar
  onPress: () => void
  currency: string
}) {
  const fmt = (n: number) =>
    `${currency} ${n.toLocaleString('en-PK')}`

  const ATTENDANCE_COLOR = {
    present: '#10B981',
    half: '#F59E0B',
    absent: '#EF4444',
  }

  const statusColor = karigar.today_status
    ? ATTENDANCE_COLOR[karigar.today_status] || '#374151'
    : '#374151'

  const wageDisplay = karigar.wage_type === 'piece_rate'
    ? `${fmt(karigar.piece_rate || 0)}/pc`
    : karigar.wage_type === 'daily'
    ? `${fmt(karigar.daily_rate || 0)}/day`
    : `${fmt(karigar.monthly_salary || 0)}/mo`

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Status indicator */}
      <View style={[
        styles.statusDot,
        { backgroundColor: statusColor }
      ]} />

      {/* Main info */}
      <View style={styles.rowMain}>
        <View style={styles.rowTop}>
          <Text style={styles.karigarName}
            numberOfLines={1}>
            {karigar.name}
          </Text>
          <Text style={styles.karigarCode}>
            {karigar.karigar_code}
          </Text>
        </View>
        <View style={styles.rowBottom}>
          <Text style={styles.wageText}>
            {wageDisplay}
          </Text>
          {karigar.peshgi_balance > 0 && (
            <View style={styles.peshgiBadge}>
              <Text style={styles.peshgiText}>
                P: {fmt(karigar.peshgi_balance)}
              </Text>
            </View>
          )}
          {karigar.today_units !== undefined &&
            karigar.today_units > 0 && (
            <Text style={styles.unitsText}>
              {karigar.today_units} units today
            </Text>
          )}
        </View>
      </View>

      {/* Attendance badge */}
      {karigar.today_status && (
        <View style={[
          styles.attendanceBadge,
          { backgroundColor: statusColor + '20',
            borderColor: statusColor + '50' }
        ]}>
          <Text style={[
            styles.attendanceText,
            { color: statusColor }
          ]}>
            {karigar.today_status === 'present'
              ? 'P' : karigar.today_status === 'half'
              ? 'H' : 'A'}
          </Text>
        </View>
      )}

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}, (prev, next) =>
  prev.karigar.id === next.karigar.id &&
  prev.karigar.today_status === next.karigar.today_status &&
  prev.karigar.peshgi_balance === next.karigar.peshgi_balance &&
  prev.karigar.today_units === next.karigar.today_units
)

export default function KarigarsScreen() {
  const { businessId, currency } =
    useBridgeStatusStore()
  const { t, features } = useIndustryConfig()

  const [karigars, setKarigars] =
    useState<Karigar[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] =
    useState(false)
  const [error, setError] =
    useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] =
    useState<'all' | 'present' | 'absent' | 'no-attendance'>('all')

  const today = new Date()
    .toISOString().split('T')[0]

  const loadKarigars = useCallback(async (
    isRefresh = false
  ) => {
    if (!businessId) return
    if (!isRefresh) setLoading(true)
    setError(null)

    try {
      // Load karigars and today's attendance
      // in parallel
      const [karigarRes, attendanceRes,
        productionRes] = await Promise.all([
        supabase
          .from('karigars')
          .select('*')
          .eq('business_id', businessId)
          .eq('status', 'active')
          .order('name'),

        supabase
          .from('attendance_logs')
          .select('karigar_id, status')
          .eq('business_id', businessId)
          .eq('attendance_date', today),

        supabase
          .from('karigar_production_logs')
          .select('karigar_id, units_produced')
          .eq('business_id', businessId)
          .eq('log_date', today),
      ])

      const attendanceMap = new Map(
        (attendanceRes.data || []).map(
          a => [a.karigar_id, a.status]
        )
      )

      const productionMap = new Map(
        (productionRes.data || []).reduce(
          (acc, p) => {
            const current = acc.get(
              p.karigar_id
            ) || 0
            acc.set(
              p.karigar_id,
              current + (p.units_produced || 0)
            )
            return acc
          },
          new Map<string, number>()
        )
      )

      const enriched = (karigarRes.data || [])
        .map(k => ({
          ...k,
          today_status: attendanceMap.get(k.id)
            || null,
          today_units: productionMap.get(k.id)
            || 0,
        }))

      setKarigars(enriched)
    } catch (err: any) {
      setError(
        'Could not load workers. ' +
        'Check your connection.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [businessId, today])

  useEffect(() => {
    loadKarigars()
  }, [loadKarigars])

  const filtered = karigars.filter(k => {
    const matchesSearch = !search ||
      k.name.toLowerCase().includes(
        search.toLowerCase()
      ) ||
      k.karigar_code.toLowerCase().includes(
        search.toLowerCase()
      )

    const matchesFilter =
      filter === 'all' ||
      (filter === 'present' &&
        k.today_status === 'present') ||
      (filter === 'absent' &&
        k.today_status === 'absent') ||
      (filter === 'no-attendance' &&
        !k.today_status)

    return matchesSearch && matchesFilter
  })

  const presentCount = karigars.filter(
    k => k.today_status === 'present'
  ).length
  const absentCount = karigars.filter(
    k => k.today_status === 'absent'
  ).length
  const noAttendanceCount = karigars.filter(
    k => !k.today_status
  ).length

  const renderItem = useCallback(
    ({ item }: { item: Karigar }) => (
      <KarigarRow
        karigar={item}
        currency={currency || 'PKR'}
        onPress={() => {
          Haptics.impactAsync(
            Haptics.ImpactFeedbackStyle.Light
          )
          router.push(
            `/(app)/karigars/${item.id}`
          )
        }}
      />
    ),
    [currency]
  )

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 72,
      offset: 72 * index,
      index,
    }),
    []
  )

  return (
    <ScreenContainer>
      <ScreenHeader
        title={t.workers}
        subtitle={`${karigars.length} active · ${presentCount} present`}
      />

      {/* Summary bar */}
      {karigars.length > 0 && (
        <View style={styles.summaryBar}>
          {[
            {
              label: 'Present',
              count: presentCount,
              color: '#10B981',
              filterVal: 'present' as const,
            },
            {
              label: 'Absent',
              count: absentCount,
              color: '#EF4444',
              filterVal: 'absent' as const,
            },
            {
              label: 'Unmarked',
              count: noAttendanceCount,
              color: '#374151',
              filterVal: 'no-attendance' as const,
            },
            {
              label: 'All',
              count: karigars.length,
              color: '#60A5FA',
              filterVal: 'all' as const,
            },
          ].map(item => (
            <TouchableOpacity
              key={item.filterVal}
              style={[
                styles.summaryCard,
                filter === item.filterVal && {
                  borderColor: item.color + '60',
                  backgroundColor: item.color + '15',
                }
              ]}
              onPress={() => {
                setFilter(item.filterVal)
                Haptics.impactAsync(
                  Haptics.ImpactFeedbackStyle.Light
                )
              }}
            >
              <Text style={[
                styles.summaryCount,
                { color: filter === item.filterVal
                    ? item.color
                    : '#6B7280' }
              ]}>
                {item.count}
              </Text>
              <Text style={styles.summaryLabel}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder={`Search ${t.workers}...`}
          placeholderTextColor="#374151"
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch('')}
          >
            <Text style={styles.clearSearch}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {loading ? (
        <SkeletonRow lines={8} height={72} />
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {error}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => loadKarigars()}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="👷"
          title={
            search
              ? `No ${t.workers} match "${search}"`
              : filter !== 'all'
              ? `No ${t.workers} in this category`
              : `No active ${t.workers}`
          }
          description={
            !search && filter === 'all'
              ? `Add ${t.workers} in Noxis Hub on your factory PC first.`
              : undefined
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true)
                loadKarigars(true)
              }}
              tintColor="#60A5FA"
            />
          }
          contentContainerStyle={
            styles.listContent
          }
        />
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  summaryBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0F1114',
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  summaryLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1114',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    height: 44,
    gap: 8,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  clearSearch: {
    color: '#6B7280',
    fontSize: 18,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    height: 72,
    gap: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  rowMain: {
    flex: 1,
    gap: 4,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  karigarName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  karigarCode: {
    fontSize: 10,
    color: '#4B5563',
    fontFamily: 'monospace',
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wageText: {
    fontSize: 11,
    color: '#6B7280',
  },
  peshgiBadge: {
    backgroundColor: 'rgba(197,160,89,0.15)',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  peshgiText: {
    fontSize: 9,
    color: '#C5A059',
    fontWeight: '600',
  },
  unitsText: {
    fontSize: 10,
    color: '#60A5FA',
  },
  attendanceBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  attendanceText: {
    fontSize: 12,
    fontWeight: '800',
  },
  chevron: {
    color: '#374151',
    fontSize: 20,
    flexShrink: 0,
  },
  listContent: {
    paddingBottom: 100,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
})
