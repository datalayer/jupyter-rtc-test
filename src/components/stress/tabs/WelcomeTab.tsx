import { CTABanner, Button, Label, Stack, Link } from "@primer/react-brand";
import { MarkGithubIcon } from "@primer/octicons-react";
import appState from "../../../state";

const WelcomeTab = (): JSX.Element => {
  return (
    <>    
      <CTABanner>
        <CTABanner.Heading>
          Jupyter RTC Test
        </CTABanner.Heading>
        <CTABanner.Description>
          Run stress tests against the current Jupyter realtime collaboration machinery.
        </CTABanner.Description>
        <CTABanner.ButtonGroup>
          <Button onClick={() => appState.setTab(2)}>Tests</Button>
          <Button onClick={() => appState.setTab(3)}>About</Button>
        </CTABanner.ButtonGroup>
        <Stack direction="horizontal" padding="none" style={{marginTop: 90}}>
          <MarkGithubIcon size={26}/> <Link href="https://github.com/datalayer/jupyter-rtc-test">Repository</Link>
        </Stack>
        <Stack direction="horizontal" padding="none" style={{marginTop: 0}}>
        </Stack>
        <Stack direction="horizontal" padding="none" style={{marginTop: 30}}>
          <Label size="medium" color="green-blue">Jupyter</Label>
          <Label size="medium" color="green-blue">RTC</Label>
          <Label size="medium" color="green-blue">Test</Label>
          <Label size="medium" color="green-blue">Stress</Label>
          <Label size="medium" color="green-blue">CRDT</Label>
          <Label size="medium" color="green-blue">Python</Label>
          <Label size="medium" color="green-blue">WebSocket</Label>
          <Label size="medium" color="green-blue">Yjs</Label>
        </Stack>
      </CTABanner>
    </>
  );
}

export default WelcomeTab;
