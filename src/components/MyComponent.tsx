import React, { useState } from "react";
import { Button, TextField, Grid2 } from "@mui/material";
import { useSavePin } from "../api/apiService";

const MyComponent = () => {
  const [pin, setPin] = useState<number | undefined>();
  const [isPinValid, setIsPinValid] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<String | null>(null);

  const { mutate, data: responseData } = useSavePin();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    if (!isNaN(value)) setPin(value);

    if (isFourDigitNumber(value)) {
      if (!allSame(value) && isNotSequential(value)) {
        setIsPinValid(true);
        setErrorMsg(null);
      } else {
        setIsPinValid(false);
        setErrorMsg("digits can't be all the same, or sequential");
      }
    } else {
      setIsPinValid(false);
    }
  };

  // Checks if all digits of a given number are the same.
  const allSame = (value: number): boolean =>
    new Set(value.toString()).size === 1;

  // Checks if the given number is a four-digit number.
  const isFourDigitNumber = (value: number): boolean =>
    value >= 1000 && value < 9999;

  // Checks if the given number is Sequential
  const isNotSequential = (value: number): boolean => {
    const numbers = "0123456789";
    const numbersRev = "9876543210";

    return (
      numbers.indexOf(String(value)) === -1 &&
      numbersRev.indexOf(String(value)) === -1
    );
  };

  const handleFakePost = () => {
    if (typeof pin === "number") {
      mutate(pin);
    } else {
      console.error("Invalid PIN");
    }
  };

  return (
    <Grid2 container alignItems="center" justifyContent="center" spacing={1}>
      <TextField
        value={pin}
        error={!!errorMsg}
        helperText={errorMsg}
        onChange={handlePinChange}
        label="PIN"
        fullWidth={false}
        slotProps={{
          input: {
            inputProps: {
              maxLength: 4,
            },
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleFakePost}
        disabled={!isPinValid}
      >
        submit
      </Button>
      {responseData && (
        <p style={{ color: "green" }}>PIN saved successfully!</p>
      )}
    </Grid2>
  );
};

export default MyComponent;
