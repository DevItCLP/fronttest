import {
  Autocomplete,
  Box,
  InputAdornment,
  CircularProgress,
  TextField,
  Typography,
  NativeSelect,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { FirstPage } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import {createFilterOptions} from "@mui/joy";
import {register} from "next/dist/client/components/react-dev-overlay/pages/client";

interface SelectProps<T> {
  _control: any;
  _setValue: any;
  errors: any;
  label: string;
  name: string;
  size?: any;
  required: boolean;
  listaData: T[];
  onChangeCallback?: (newValue: { label: string; value: number } | null) => void;
}

/* EJEMPLO DE USO
   <SelectCC _control={control} _setValue={setValue} label=" Areas" name="area" size="small" required={true} errors={errors} listaData={listaAreas} />
 */
export const SelectCC: React.FC<SelectProps<any>> = ({ _control, _setValue, label, name, size, required, errors, listaData, onChangeCallback }) => {
  const listaAux = [
    {
      label: "No options",
      value: "-1",
    },
  ];

  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const selectRef = useRef<any>(null);

  const handleDataChange = (newval: any) => {
    setSelectedOpt(newval);
    if (newval) {
      _setValue(name, newval.value);
      if (onChangeCallback) {
        onChangeCallback(newval);
      }
    } else {
      _setValue(name, undefined);
    }
  };

  return (
    <div>
      <Controller
        name={name}
        control={_control}
        rules={{ required: { value: required, message: `${label} is required` } }}
        render={({ field }) => (
          <Autocomplete
            fullWidth
            id={name}
            options={listaData ? listaData : listaAux}
            size={size}
            value={selectedOpt}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onChange={(_, newValue) => {
              handleDataChange(newValue);
            }}
            renderInput={(params) => (
              <Box>
                <TextField {...params} ref={selectRef} label={required ? "* " + label : "" + label} />
              </Box>
            )}
          />
        )}
      />

      {errors[name] && typeof errors[name].message === "string" && <Typography color="error">{errors[name].message}</Typography>}
    </div>
  );
};

interface Select2Props<T> {
  register: any;
  errors: any;
  label: string;
  name: string;
  size?: any;
  required: boolean;
}

export const SelectStatusCC: React.FC<Select2Props<any>> = ({ register, label, name, size, required, errors }) => {
  const [status, setStatus] = useState("2");

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };
  return (
    <div>
      <FormControl size="small" fullWidth>
        <InputLabel htmlFor={name}>
          {label}
        </InputLabel>
        <Select
          {...register(name, {
            required: { value: required, message: `${label} is required` },
          })}
          size={size}
          id={name}
          value={status}
          label={label}
          onChange={handleChange}
        >
          <MenuItem value={2}>ACTIVO</MenuItem>
          <MenuItem value={0}>INACTIVO</MenuItem>
        </Select>
      </FormControl>
      {errors[name] && typeof errors[name].message === "string" && <Typography color="error">{errors[name].message}</Typography>}
    </div>
  );
};


export const SelectSimple: React.FC<SelectProps<any>> = ({ _control, _setValue, label, name, size, required, errors, listaData, onChangeCallback }) => {
  const listaAux = [
    {
      label: "No options",
      value: "-1",
    },
  ];
  const selectRef = useRef<HTMLSelectElement>(null);


  return (
      <div>
        <FormControl size="small" fullWidth>
          <InputLabel id={name}>
            * {label}
          </InputLabel>
        <Controller
            name={name}
            control={_control}
            defaultValue=""
            rules={{ required: { value: required, message: `${label} is required` } }}
            render={({ field }) => (
                <Select


                    size={size}
                    fullWidth
                    id={name}
                    defaultValue=""
                    inputRef={selectRef}
                    labelId={name}
                    label={label}
                    {...field}
                >
                  {listaData.map((material) => (
                      <MenuItem key={material.value} value={material.value}>
                        {material.label}
                      </MenuItem>
                  ))}
                </Select>
            )}

        />
        </FormControl>





        {errors[name] && typeof errors[name].message === "string" && <Typography color="error">{errors[name].message}</Typography>}
      </div>
  );
};