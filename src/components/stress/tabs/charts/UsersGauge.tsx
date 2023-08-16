import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, GaugeChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use(
  [
    BarChart,
    CanvasRenderer,
    GaugeChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
  ]
);

type Props = {
  title: string,
  ok: number,
  nok: number,
}

const StackedGauge = (props: Props) => {
  const { title, ok, nok } = props;
  const total = ok + nok;
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
        max: total,
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
      style={{ height: 400 }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}

const UsersGauge = (props: Props) => {
  const { title, ok, nok } = props;
  return (
    <>
      { (ok + nok) > 0 ?      
         <StackedGauge title={title} ok={ok} nok={nok}/>
        :
         <></>
      }
    </>
  );
}

export default UsersGauge;
