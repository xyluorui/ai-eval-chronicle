<script setup lang="ts">
import type { Benchmark } from '../../../data/benchmarks'

const props = defineProps<{ item: Benchmark }>()

const categoryColors: Record<string, string> = {
  '通用能力': 'var(--cat-general)',
  '推理与数学': 'var(--cat-reasoning)',
  '代码能力': 'var(--cat-code)',
  'Agent能力': 'var(--cat-agent)',
  '对话与偏好': 'var(--cat-dialogue)',
  '安全与对齐': 'var(--cat-safety)',
  '中文评测': 'var(--cat-chinese)',
  '多模态': 'var(--cat-multimodal)',
}

const statusConfig: Record<string, { color: string; label: string }> = {
  '活跃': { color: 'var(--color-active)', label: '活跃' },
  '经典': { color: 'var(--color-classic)', label: '经典' },
  '已被超越': { color: 'var(--color-superseded)', label: '已被超越' },
}
</script>

<template>
  <article
    class="card"
    :style="{ '--accent': categoryColors[item.category] || 'var(--cat-general)' }"
  >
    <!-- Accent border -->
    <div class="card-accent" />

    <div class="card-body">
      <!-- Row 1: badges -->
      <div class="card-badges">
        <span
          class="badge badge-category"
          :style="{ '--badge-color': categoryColors[item.category] }"
        >
          {{ item.category }}
        </span>
        <span
          class="badge badge-status"
          :style="{ '--badge-color': statusConfig[item.status]?.color }"
        >
          <span class="status-dot" />
          {{ statusConfig[item.status]?.label }}
        </span>
      </div>

      <!-- Row 2: title + date -->
      <div class="card-heading">
        <h3 class="card-title">
          <a v-if="item.link" :href="item.link" target="_blank" rel="noopener">
            {{ item.name }}
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <span v-else>{{ item.name }}</span>
        </h3>
        <time class="card-date">{{ item.date }}</time>
      </div>

      <!-- Row 3: authors -->
      <p class="card-authors">{{ item.authors }}</p>

      <!-- Row 4: description -->
      <p class="card-desc">{{ item.description }}</p>

      <!-- Row 5: significance -->
      <div class="card-significance">
        <svg class="sig-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <p>{{ item.significance }}</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  border-radius: 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--accent);
}

.dark .card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
}

.card-accent {
  flex-shrink: 0;
  width: 4px;
  background: var(--accent);
}

.card-body {
  flex: 1;
  padding: 16px 20px;
  min-width: 0;
}

/* Badges */
.card-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
}

.badge-category {
  background: color-mix(in srgb, var(--badge-color) 14%, transparent);
  color: var(--badge-color);
}

.dark .badge-category {
  background: color-mix(in srgb, var(--badge-color) 20%, transparent);
}

.badge-status {
  background: color-mix(in srgb, var(--badge-color) 10%, transparent);
  color: var(--badge-color);
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--badge-color);
}

/* Heading */
.card-heading {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 4px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
}

.card-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.15s;
}

.card-title a:hover {
  color: var(--accent);
}

.link-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-left: 4px;
  opacity: 0;
  transform: translateY(-1px);
  transition: opacity 0.15s;
}

.card:hover .link-icon {
  opacity: 0.5;
}

.card-date {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-variant-numeric: tabular-nums;
}

/* Authors */
.card-authors {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 0 0 10px;
  line-height: 1.4;
}

/* Description */
.card-desc {
  font-size: 14px;
  color: var(--vp-c-text-1);
  margin: 0 0 10px;
  line-height: 1.65;
}

/* Significance */
.card-significance {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}

.sig-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  color: var(--accent);
  opacity: 0.7;
}

.card-significance p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* Mobile */
@media (max-width: 640px) {
  .card-body {
    padding: 12px 14px;
  }

  .card-heading {
    flex-direction: column;
    gap: 2px;
  }

  .card-title {
    font-size: 16px;
  }
}
</style>
