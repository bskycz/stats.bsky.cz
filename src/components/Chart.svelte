<script>
  import { Chart } from "svelte-echarts";

  import { init, use } from "echarts/core";
  import { BarChart, LineChart } from "echarts/charts";
  import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
  } from "echarts/components";
  import { CanvasRenderer } from "echarts/renderers";
  import { onMount } from "svelte";

  const { lineData, barData, title, type = "users" } = $props();
  let loaded = $state(false);

  // now with tree-shaking
  use([
    BarChart,
    LineChart,
    GridComponent,
    CanvasRenderer,
    TitleComponent,
    TooltipComponent,
  ]);

  let options = {
    tooltip: {
      trigger: "axis",

      axisPointer: {
        animation: false,
      },
    },
    grid: {
      top: "10%",
      left: "1%",
      right: "1%",
      bottom: "1%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
    },
    yAxis: [
      {
        type: "value",
        //boundaryGap: [0, "100%"],
        splitLine: {
          show: false,
        },
      },
      {
        type: "value",
        splitLine: {
          show: false,
          lineStyle: {
            color: "#333333",
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        data: barData,
        showSymbol: false,
      },
      {
        type: "line",
        data: lineData,
        showSymbol: false,
        yAxisIndex: 1,
      },
    ],
  };

  onMount(() => {
    loaded = true;
  });
</script>

<div class="app">
  {#if loaded}
    <Chart {init} {options} />
  {:else}
    <div
      class="w-full h-full rounded-xl duration-500 flex items-center justify-center text-2xl text-neutral-content/50 blur"
      style="background-image: url(/graph-{type}.webp); background-size: 100% 100%; background-position: {type ===
      'posts'
        ? '-1px 4px'
        : '-5px 3px'};"
    ></div>
  {/if}
</div>

<style>
  .app {
    width: 100%;
    height: 150px;
  }
</style>
