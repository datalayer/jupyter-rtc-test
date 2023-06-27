import {
  RadialGauge, RadialGaugeArc, StackedRadialGaugeSeries,
  StackedRadialGaugeValueLabel, StackedRadialGaugeDescriptionLabel
} from 'reaviz';
import useColors from './../../../../hooks/ColorsHook';

const categoryData = [
  {
    key: 'Numer of documents having converged',
    data: 10
  },
  {
    key: 'Number of documents having NOT converged',
    data: 14
  },
];

export const StackedExample = () => {
  const maxValue = 24
  const { okColor, nokColor } = useColors();
  const colorScheme: string[] = [okColor, nokColor];
  return (
    <RadialGauge
      data={categoryData}
      startAngle={0}
      endAngle={Math.PI * 2}
      height={450}
      minValue={0}
      maxValue={maxValue}
      series={
        <StackedRadialGaugeSeries
          arcPadding={0.1}
          fillFactor={0.3}
          colorScheme={colorScheme}
          label={<StackedRadialGaugeValueLabel label="" />}
          descriptionLabel={<StackedRadialGaugeDescriptionLabel label="" />}
          outerArc={<RadialGaugeArc color="white"/>}
        />
      }
    />
  );
};

const Chart = () => {
  return (
    <>
      <StackedExample/>
    </>
  )
}

export default Chart;
