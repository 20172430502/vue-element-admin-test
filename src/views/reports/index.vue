<template>
  <div class="reports">
    <chart height="100%" width="100%" />
  </div>
</template>
<script>
import Chart from '@/components/Charts/Keyboard'
export default {
  name: "reports",
  components: { Chart }
};
</script>
<style scoped>
.reports{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>