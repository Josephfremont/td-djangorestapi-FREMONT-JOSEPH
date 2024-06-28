import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultipleSelectChip = ({ data, selectedChercheur, setSelectedChercheur }) => {

  const [valueSelect, setValueSelect] = React.useState(
    selectedChercheur
      ? selectedChercheur.map((projetId) => data.find((projet) => projet.id === projetId))
      : []
  );

  console.log('data ',data,' selectedChercheur ')

  const handleChange = (event) => {
    const {target: { value },} = event;
    setSelectedChercheur(value.map((uneValue) => uneValue.id));
    setValueSelect(typeof value === 'string' ? value.split(',') : value,)
  };

  return(
      <div>
        {valueSelect && (
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="projets-label">Projets</InputLabel>
            <Select
              multiple
              value={valueSelect}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value.id} label={value.titre} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {data.map((item) => (
                <MenuItem key={item.id} value={item}>
                  {item.titre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
    );
};

export default MultipleSelectChip;
