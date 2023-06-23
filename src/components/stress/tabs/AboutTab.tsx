import { Box } from "@primer/react";
import { FAQ, InlineLink, Text, River, Link, Heading, ThemeProvider } from "@primer/react-brand";
import styled from 'styled-components';
import appState from "../../../state";

import ArchitectureSvg from "./../../../../style/svg/architecture.image.svg";

const AboutTab = (): JSX.Element => {
  const Styled = styled.div`
    .custom-colors[data-color-mode='light'] {
      --brand-Accordion-toggle-color-start: var(--base-color-scale-green-1);
      --brand-Accordion-toggle-color-end: var(--base-color-scale-blue-3);
      --brand-FAQ-heading-color: linear-gradient(271.72deg, var(--base-color-scale-green-1) 7.09%, var(--base-color-scale-blue-3) 96.61%);
      padding: 3rem;
      background-color: var(--brand-color-canvas-default);
    }
    .custom-heading {
      background: var(--brand-FAQ-heading-color);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    `

  return (
    <>
      <Box sx={{margin: "auto", maxWidth: 'var(--brand-breakpoint-xlarge)'}}>
        <River align="end">
          <River.Visual>
            <ArchitectureSvg/>
          </River.Visual>
          <River.Content>
            <Heading>Architecture</Heading>
            <Text>
            You can run via CLI 64 python unit tests with pytest 76 javascript unit tests with jest. This ensures that the environement and basic functionality is available.
            <br/>
            <br/>
            You can run 2 stress tests via CLI or via UI.
            <br/>
            <br/>            
            See the left diagram to know more about the stress tests arechitecture, 
            see also this <InlineLink href="https://github.com/datalayer/jupyter-rtc-test/blob/main/docs/why.md">this document</InlineLink> to know more about the technical stack.
            </Text>
            <Link onClick={() => appState.setTab(2)}>Run the tests</Link>
          </River.Content>
        </River>
        <Styled>
          <ThemeProvider colorMode="light" className="custom-colors" style={{backgroundColor: 'var(--brand-color-canvas-default'}}>
            <Box p={3}>
              <FAQ>
                <FAQ.Heading className="custom-heading">Frequently asked questions</FAQ.Heading>
                <FAQ.Item>
                  <FAQ.Question>Why do we need this?</FAQ.Question>
                  <FAQ.Answer>
                    <p>
                      Read the details on <InlineLink href="https://github.com/datalayer/jupyter-rtc-test/blob/main/docs/why.md">this document</InlineLink>.
                    </p>
                  </FAQ.Answer>
                </FAQ.Item>
                <FAQ.Item>
                  <FAQ.Question>Why can I can use it?</FAQ.Question>
                  <FAQ.Answer>
                    <p>
                      For now you have to build and use if <InlineLink href="https://github.com/datalayer/jupyter-rtc-test/blob/main/docs/use.md">from source</InlineLink>.
                    </p>
                  </FAQ.Answer>
                </FAQ.Item>
              </FAQ>
            </Box>
          </ThemeProvider>
        </Styled>
      </Box>
    </>
  );
}

export default AboutTab;
