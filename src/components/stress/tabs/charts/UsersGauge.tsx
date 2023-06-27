import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  // LineChart,
  BarChart,
  // PieChart,
  // ScatterChart,
  // RadarChart,
  // MapChart,
  // TreeChart,
  // TreemapChart,
  // GraphChart,
  GaugeChart,
  // FunnelChart,
  // ParallelChart,
  // SankeyChart,
  // BoxplotChart,
  // CandlestickChart,
  // EffectScatterChart,
  // LinesChart,
  // HeatmapChart,
  // PictorialBarChart,
  // ThemeRiverChart,
  // SunburstChart,
  // CustomChart,
} from 'echarts/charts';
// import components, all suffixed with Component
import {
  // GridSimpleComponent,
  GridComponent,
  // PolarComponent,
  // RadarComponent,
  // GeoComponent,
  // SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  // ToolboxComponent,
  TooltipComponent,
  // AxisPointerComponent,
  // BrushComponent,
  TitleComponent,
  // TimelineComponent,
  // MarkPointComponent,
  // MarkLineComponent,
  // MarkAreaComponent,
  // LegendComponent,
  // LegendScrollComponent,
  // LegendPlainComponent,
  // DataZoomComponent,
  // DataZoomInsideComponent,
  // DataZoomSliderComponent,
  // VisualMapComponent,
  // VisualMapContinuousComponent,
  // VisualMapPiecewiseComponent,
  // AriaComponent,
  // TransformComponent,
  // DatasetComponent,
} from 'echarts/components';
import {
  CanvasRenderer,
  // SVGRenderer,
} from 'echarts/renderers';

echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer, GaugeChart]
);

const StackedGauge = (props: { title: string, ok: number, nok: number }) => {
  const { title, ok, nok } = props;
  const option = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: title,
        type: 'gauge',
        progress: {
          show: true
        },
        min: 0,
        max: ok + nok,  
        detail: {
          formatter: '{value}'
        },
        data: [
          {
            value: ok,
            name: title
          }
        ]
      }
    ]
  };
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ width: "600px", height: "300px" }}
      notMerge={true}
      lazyUpdate={true}
//      theme={"theme_name"}
//      onChartReady={this.onChartReadyCallback}
//      onEvents={EventsDict}
/>
  );
};

const UsersGauge = (props: { title: string, ok: number, nok: number }) => {
  const { title, ok, nok } = props;
  return (
    <>
      { (ok + nok) > 0 ?      
         <StackedGauge title={title} ok={ok} nok={nok}/>
        :
         <></>
      }
    </>
  )
}

export default UsersGauge;
