import { HeartOutlineIcon } from "@datalayer/icons-react";
import { Avatar, AvatarPair, Box } from "@primer/react";
import { FAQ, InlineLink, Text, River, Link, Heading, ThemeProvider } from "@primer/react-brand";
import styled from 'styled-components';
import appState from "../../../state";

import ActorsImage from "./../../../../style/svg/jupyter-rtc-test-actors.image.svg";
import StackImage from "./../../../../style/svg/jupyter-rtc-stack.image.svg";

const By = () => (
  <AvatarPair>
    <Avatar src="https://avatars.githubusercontent.com/datalayer" />
    <Avatar src="https://avatars.githubusercontent.com/anaconda" />
  </AvatarPair>
)

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
      <River>
          <River.Visual>
            <ActorsImage/>
          </River.Visual>
          <River.Content>
            <Heading>Actors</Heading>
            <Text>
              You can run unit tests (64 python and 76 javascript unit tests) via CLI. These unit tests ensure that both the environment and basic features are functional.
              <br/>
              <br/>
              We add to the unit tests a suite of stress tests you can run via CLI or via UI base on pre-defined scenarii. You can configure the scenarii and see how the system behaves.
              <br/>
              <br/>            
              The diagram at the right represents the various actors of the tests architecture.
              <br/>
              <br/>
              Bot unit and stress tests are good ways to learn about then Jupyter RTC internals and how to develop on top of it.
              <br/>
              <br/>            
              <Link onClick={() => appState.setTab(2)}>Run the tests</Link>
            </Text>
          </River.Content>
        </River>
        <River align="end">
          <River.Visual>
            <StackImage/>
          </River.Visual>
          <River.Content>
            <Heading>Architecture</Heading>
            <Text>
              The diagram at the left represents the various technical software building blocks. Those building are spread in 7 various GitHub repositories.
              <br/>
              <br/>
              See also this <InlineLink href="https://github.com/datalayer/jupyter-rtc-test/blob/main/docs/architecture.md">this document</InlineLink> to know more about the technical stack.
            </Text>
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
                  <FAQ.Question>How can I can use it?</FAQ.Question>
                  <FAQ.Answer>
                    <p>
                      For now you have to build and use if <InlineLink href="https://github.com/datalayer/jupyter-rtc-test/blob/main/docs/use.md">from source</InlineLink>.
                    </p>
                  </FAQ.Answer>
                </FAQ.Item>
                <FAQ.Item>
                  <FAQ.Question>Who is developing this tool?</FAQ.Question>
                  <FAQ.Answer>
                    <p>
                      This is done with <HeartOutlineIcon/> by <By/>.
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
