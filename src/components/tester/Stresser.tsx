import { useState } from 'react';
import { ThemeProvider, BaseStyles, Box } from '@primer/react';
import { CodeIcon } from '@primer/octicons-react';
import { UnderlineNav } from '@primer/react/drafts';
import Tests from './Tests';

const Stresser = (): JSX.Element => {
  const [tab, setTab] = useState(1);
  return (
    <>
      <ThemeProvider>
        <BaseStyles>
          <Box>
            <UnderlineNav>
              <UnderlineNav.Item
                aria-current="page"
                icon={CodeIcon}
                onSelect={e => {
                  e.preventDefault();
                  setTab(1);
                }}
              >
                Tests
              </UnderlineNav.Item>
            </UnderlineNav>
            <Box p={3}>
              {tab === 1 && <Tests />}
            </Box>
          </Box>
        </BaseStyles>
      </ThemeProvider>
    </>
  );
};

export default Stresser;
