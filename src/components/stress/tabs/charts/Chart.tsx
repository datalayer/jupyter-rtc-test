import { RadialGauge, RadialGaugeSeries, RadialGaugeArc } from 'reaviz';

const Chart = () => {
  return (
    <>
      <RadialGauge data={[{
          key: 'Austin, TX',
          data: 24
        }]}
        height={300} width={300} series={<RadialGaugeSeries outerArc={<RadialGaugeArc disabled={true} animated={false} />} innerArc={<RadialGaugeArc cornerRadius={12.5} />} arcWidth={25} colorScheme={['#38e52c']} />} 
      />
    </>
  )
}

export default Chart;
