<script setup lang="ts">
import { computed } from 'vue'
import TimelineCard from './TimelineCard.vue'
import { useTimeline } from '../composables/useTimeline'

const {
  selectedYear,
  selectedCategory,
  selectedStatus,
  years,
  categoryOptions,
  statusOptions,
  filtered,
  count,
  reset,
} = useTimeline()

interface YearGroup {
  year: string
  items: typeof filtered.value
}

const groupedByYear = computed<YearGroup[]>(() => {
  const groups: Record<string, typeof filtered.value> = {}
  for (const item of filtered.value) {
    const year = item.date.slice(0, 4)
    if (!groups[year]) groups[year] = []
    groups[year].push(item)
  }
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map(year => ({ year, items: groups[year] }))
})

const hasActiveFilter = computed(() =>
  selectedYear.value !== '全部' ||
  selectedCategory.value !== '全部' ||
  selectedStatus.value !== '全部'
)
</script>

<template>
  <section class="tl">
    <!-- Filters -->
    <div class="filters">
      <div class="filter-row">
        <span class="filter-label">年份</span>
        <div class="chips">
          <button
            v-for="year in years"
            :key="year"
            :class="['chip', { active: selectedYear === year }]"
            @click="selectedYear = year"
          >{{ year }}</button>
        </div>
      </div>

      <div class="filter-row">
        <span class="filter-label">类别</span>
        <div class="chips">
          <button
            v-for="cat in categoryOptions"
            :key="cat"
            :class="['chip', { active: selectedCategory === cat }]"
            @click="selectedCategory = cat as any"
          >{{ cat }}</button>
        </div>
      </div>

      <div class="filter-row">
        <span class="filter-label">状态</span>
        <div class="chips">
          <button
            v-for="s in statusOptions"
            :key="s"
            :class="['chip', { active: selectedStatus === s }]"
            @click="selectedStatus = s as any"
          >{{ s }}</button>
        </div>
      </div>

      <Transition name="fade">
        <button v-if="hasActiveFilter" class="reset-btn" @click="reset">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          重置筛选
        </button>
      </Transition>
    </div>

    <!-- Divider -->
    <div class="section-divider">
      <span class="divider-line" />
      <span class="divider-text">
        <svg class="divider-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        按时间倒序 · {{ count }} 项评测
      </span>
      <span class="divider-line" />
    </div>

    <!-- Timeline -->
    <div class="timeline">
      <template v-for="group in groupedByYear" :key="group.year">
        <!-- Year separator -->
        <div class="year-separator">
          <div class="year-dot" />
          <span class="year-label">{{ group.year }}</span>
        </div>

        <!-- Cards with alternating sides (3-column grid) -->
        <div
          v-for="(item, idx) in group.items"
          :key="item.id"
          :class="['timeline-item', idx % 2 === 0 ? 'side-left' : 'side-right']"
        >
          <!-- Left column -->
          <div class="col-left">
            <template v-if="idx % 2 === 0">
              <TimelineCard :item="item" />
            </template>
            <template v-else>
              <div class="item-meta align-right">
                <time class="meta-date">{{ item.date }}</time>
                <span class="meta-name">{{ item.name }}</span>
              </div>
            </template>
          </div>

          <!-- Center column: dot + rail -->
          <div class="col-center">
            <div class="rail-segment" />
            <div class="item-dot" />
            <div class="rail-segment" />
          </div>

          <!-- Right column -->
          <div class="col-right">
            <template v-if="idx % 2 !== 0">
              <TimelineCard :item="item" />
            </template>
            <template v-else>
              <div class="item-meta align-left">
                <time class="meta-date">{{ item.date }}</time>
                <span class="meta-name">{{ item.name }}</span>
              </div>
            </template>
          </div>

          <!-- Mobile-only card (hidden on desktop) -->
          <div v-if="idx % 2 === 0" class="col-mobile-card">
            <TimelineCard :item="item" />
          </div>
        </div>
      </template>

      <!-- Empty -->
      <div v-if="filtered.length === 0" class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>没有匹配的评测基准</p>
        <button class="reset-btn" @click="reset">清除筛选条件</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tl {
  max-width: calc(1152px + 48px);
  margin: 0 auto;
  padding: 32px 24px 64px;
}

@media (min-width: 960px) {
  .tl {
    max-width: calc(1152px + 128px);
    padding: 32px 64px 64px;
  }
}

/* ---- Divider ---- */
.section-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 32px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--vp-c-divider);
}

.divider-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.divider-icon {
  width: 14px;
  height: 14px;
}

/* ---- Filters ---- */
.filters {
  margin-bottom: 36px;
  padding: 16px 20px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.filter-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}

.filter-row:last-of-type {
  margin-bottom: 0;
}

.filter-label {
  flex-shrink: 0;
  width: 40px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-3);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  padding: 3px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 450;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.chip.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
  font-weight: 500;
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  background: none;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.15s;
}

.reset-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

/* ---- Timeline ---- */
.timeline {
  position: relative;
  padding: 0;
}

/* Year separator */
.year-separator {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 32px 0 24px;
  z-index: 2;
}

.year-separator::before,
.year-separator::after {
  content: '';
  position: absolute;
  left: 50%;
  width: 2px;
  background: var(--vp-c-divider);
  transform: translateX(-50%);
}

.year-separator::before {
  top: 0;
  bottom: 50%;
}

.year-separator::after {
  top: 50%;
  bottom: 0;
}

.year-separator:first-child {
  margin-top: 8px;
}

.year-separator:first-child::before {
  display: none;
}

.year-dot {
  position: relative;
  z-index: 3;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 3px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.year-label {
  position: relative;
  z-index: 3;
  padding: 4px 20px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: var(--vp-c-brand-1);
  letter-spacing: 0.5px;
}

/* Timeline item — 3 column grid */
.timeline-item {
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  margin-bottom: 20px;
}

/* Center column: vertical rail + dot */
.col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.rail-segment {
  width: 2px;
  flex: 1;
  background: var(--vp-c-divider);
}

.item-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-brand-2);
  flex-shrink: 0;
  margin: 12px 0;
  transition: background 0.2s, border-color 0.2s;
  position: relative;
}

.timeline-item:hover .item-dot {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

/* Connector lines from dot to card */
.item-dot::before,
.item-dot::after {
  content: '';
  position: absolute;
  top: 50%;
  height: 1px;
  background: var(--vp-c-divider);
  width: 15px;
  z-index: -1;
}

.item-dot::before {
  right: 100%;
}

.item-dot::after {
  left: 100%;
}

/* Left/right columns */
.col-left {
  padding-right: 0;
}

.col-right {
  padding-left: 0;
}

/* Mobile-only card: hidden on desktop */
.col-mobile-card {
  display: none;
}

/* Left/right columns stretch to full row height */
.col-left,
.col-right {
  display: flex;
  align-items: center;
}

/* Meta info (date & name on opposite side) */
.item-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.align-right {
  text-align: right;
  padding-right: 8px;
}

.align-left {
  text-align: left;
  padding-left: 8px;
}

.meta-date {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.meta-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

/* ---- Empty state ---- */
.empty {
  text-align: center;
  padding: 64px 0;
  color: var(--vp-c-text-3);
}

.empty svg {
  margin: 0 auto 12px;
  opacity: 0.4;
}

.empty p {
  font-size: 15px;
  margin: 0 0 16px;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .tl {
    padding: 20px 12px 48px;
  }

  .timeline-item {
    grid-template-columns: 24px 1fr;
  }

  .col-left {
    display: none;
  }

  .col-right .item-meta {
    display: none;
  }

  .col-right {
    padding-left: 12px;
  }

  .col-center {
    order: -1;
  }

  .col-mobile-card {
    display: block;
    grid-column: 2;
    padding-left: 12px;
  }

  .item-dot::before {
    display: none;
  }

  .item-dot::after {
    width: 8px;
  }

  .year-separator {
    justify-content: flex-start;
    padding-left: 32px;
    margin: 24px 0 16px;
  }

  .year-separator::before,
  .year-separator::after {
    left: 12px;
  }

  .year-dot {
    left: 12px;
  }

  .filter-row {
    flex-wrap: wrap;
  }

  .filter-label {
    width: 100%;
    margin-bottom: 4px;
  }

  .chip {
    font-size: 12px;
    padding: 2px 10px;
  }
}
</style>
