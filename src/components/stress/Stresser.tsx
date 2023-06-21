import { observer } from 'mobx-react';
import { ThemeProvider, BaseStyles, Box } from '@primer/react';
import { UnderlineNav } from '@primer/react/drafts';
import { HomeIcon } from '@primer/octicons-react';
import { DatalayerGreenIcon, JupyterBaseIcon } from '@datalayer/icons-react';
import WelcomeTab from './tabs/WelcomeTab';
import TestTab from './tabs/TesterTab';
import AboutTab from './tabs/AboutTab';

import '@primer/react-brand/lib/css/main.css';

import appState from "../../state";

const Stresser = observer((): JSX.Element => {
  return (
    <>
      <ThemeProvider>
        <BaseStyles>
          <Box>
            <UnderlineNav aria-current="page" aria-label="Jupyter RTC Test">
              <UnderlineNav.Item
                aria-current={appState.tab === 1 ? "page" : undefined}
                aria-label="home"
                icon={HomeIcon}
                onSelect={e => {
                  appState.setTab(1);
                  e.preventDefault();
                }}
              >
                Home
              </UnderlineNav.Item>
              <UnderlineNav.Item
                aria-current={appState.tab === 2 ? "page" : undefined}
                aria-label="tester"
                icon={() => <JupyterBaseIcon colored/>}
                onSelect={e => {
                  appState.setTab(2);
                  e.preventDefault();
                }}
              >
                Tests
              </UnderlineNav.Item>
              <UnderlineNav.Item
                aria-current={appState.tab === 3 ? "page" : undefined}
                aria-label="about"
                icon={() => <DatalayerGreenIcon colored/>}
                onSelect={e => {
                  appState.setTab(3);
                  e.preventDefault();
                }}
              >
                About
              </UnderlineNav.Item>
            </UnderlineNav>
            <Box p={3}>
              {appState.tab === 1 && <WelcomeTab />}
              {appState.tab === 2 && <TestTab />}
              {appState.tab === 3 && <AboutTab />}
            </Box>
          </Box>
        </BaseStyles>
      </ThemeProvider>
    </>
  );
});

export default Stresser;
