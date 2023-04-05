import { useState } from 'react';
import { ThemeProvider, BaseStyles, Box } from '@primer/react';
import {
  CpuIcon,
  CodeIcon,
  AlertIcon,
  HistoryIcon,
  CommentDiscussionIcon
} from '@primer/octicons-react';
import { UnderlineNav } from '@primer/react/drafts';
import MockTab1 from './MockTab1';

const MockComponent = (): JSX.Element => {
  const [tab, setTab] = useState(1);
  return (
    <>
      <ThemeProvider>
        <BaseStyles>
          <Box style={{ maxWidth: 700 }}>
            <Box mb={3}>
              <UnderlineNav>
                <UnderlineNav.Item
                  aria-current="page"
                  icon={CpuIcon}
                  onSelect={e => {
                    e.preventDefault();
                    setTab(1);
                  }}
                >
                  Kernels
                </UnderlineNav.Item>
                <UnderlineNav.Item
                  icon={CodeIcon}
                  counter={6}
                  onSelect={e => {
                    e.preventDefault();
                    setTab(2);
                  }}
                >
                  Notebooks
                </UnderlineNav.Item>
                <UnderlineNav.Item
                  icon={AlertIcon}
                  onSelect={e => {
                    e.preventDefault();
                    setTab(3);
                  }}
                >
                  Warnings
                </UnderlineNav.Item>
                <UnderlineNav.Item
                  icon={HistoryIcon}
                  counter={7}
                  onSelect={e => {
                    e.preventDefault();
                    setTab(4);
                  }}
                >
                  History
                </UnderlineNav.Item>
                <UnderlineNav.Item
                  icon={CommentDiscussionIcon}
                  onSelect={e => {
                    e.preventDefault();
                    setTab(5);
                  }}
                >
                  More
                </UnderlineNav.Item>
              </UnderlineNav>
            </Box>
            <Box>
              {tab === 1 && <MockTab1 />}
            </Box>
          </Box>
        </BaseStyles>
      </ThemeProvider>
    </>
  );
};

export default MockComponent;
