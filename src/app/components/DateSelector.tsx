import { useState } from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface DateSelectorProps {
  onDateChange: (date: string) => void; // Función para manejar el cambio de fecha
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD"); // Formato deseado
      onDateChange(formattedDate); // Llamar a la función con la fecha seleccionada
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Selecciona una fecha"
        value={selectedDate}
        onChange={handleDateChange}
        sx={{ width: "100%" }}
        // renderInput={(params: any) => <TextField {...params} fullWidth />}
      />
    </LocalizationProvider>
  );
};

export default DateSelector;
