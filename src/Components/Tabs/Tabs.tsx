import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Grid, Typography } from '@mui/material';
import GeneralsTable from './GeneralTab';
import MovementsTab from './MovementsTab';
import IncidentTab from './IncidentTab';
import { MongoChart } from './MongoTab';
import BasicModal from './Modal';
import useSettings from '../../Hooks/useSettings';

interface ItemDetail {
  id: string;
  user: string;
  name: string;
  transaction_id: number;
  amount: number;
  comments: string;
}

export default function Tabs() {
  const { income, expenses, debt, groupDetails } = useSettings();
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="General" value="1" />
            <Tab label="Movements" value="2" />
            <Tab label="Incidents" value="3" />
            <Tab label="Details" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <GeneralsTable rows={groupDetails} />
        </TabPanel>
        <TabPanel value="2">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography sx={{ flex: '1 1 100%' }} variant="h5" id="tableTitle" component="div">
              Incomes
            </Typography>
            <Grid container spacing={0.5}>
              <BasicModal modal_type="income" />
            </Grid>
            <MovementsTab type="income" rows={income} actions />
            <Typography sx={{ flex: '1 1 100%' }} variant="h5" id="tableTitle" component="div">
              Pending
            </Typography>
            <Grid container spacing={0.5}>
              <BasicModal modal_type="debt" />
            </Grid>
            <MovementsTab type="debt" rows={debt} actions />
            <Typography sx={{ flex: '1 1 100%' }} variant="h5" id="tableTitle" component="div">
              Expenses
            </Typography>
            <Grid container spacing={0.5}>
              <BasicModal modal_type="expenses" />
            </Grid>
            <MovementsTab type="expense" rows={expenses} actions />
          </Box>
        </TabPanel>
        <TabPanel value="3">
          <IncidentTab />
        </TabPanel>
        <TabPanel value="4">
          <MongoChart />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
