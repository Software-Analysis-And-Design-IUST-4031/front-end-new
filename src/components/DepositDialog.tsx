import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  IconButton,
  styled,
} from "@mui/material";
import { userService } from "../services/userService";
import { useSnackbar } from "notistack";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CloseIcon from "@mui/icons-material/Close";

interface DepositDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: theme.palette.mode === "dark" ? "#1A1A1A" : "#FFFFFF",
    borderRadius: "16px",
    padding: theme.spacing(2),
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 32px rgba(0, 0, 0, 0.4)"
        : "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
}));

const CoinIcon = styled(MonetizationOnIcon)(({ theme }) => ({
  fontSize: "2.5rem",
  color: theme.palette.mode === "dark" ? "#FFD700" : "#B8860B",
  filter: "drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.02)",
    "& fieldset": {
      borderColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)",
    },
    "&:hover fieldset": {
      borderColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(0, 0, 0, 0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.mode === "dark" ? "#FFD700" : "#B8860B",
    },
  },
  "& .MuiInputLabel-root": {
    color:
      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.7)" : undefined,
  },
  "& .MuiInputBase-input": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : undefined,
  },
}));

const DepositDialog: React.FC<DepositDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      enqueueSnackbar("Please enter a valid amount", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      await userService.depositDollars(Number(amount));
      enqueueSnackbar(`Successfully deposited ${Number(amount)} coins`, {
        variant: "success",
      });
      onSuccess?.();
      onClose();
      setAmount("");
    } catch (error: any) {
      console.error("Error depositing coins:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Failed to deposit coins. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <DialogTitle
          sx={{
            color: theme.palette.mode === "dark" ? "#FFFFFF" : undefined,
            p: 0,
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          Deposit Coins
        </DialogTitle>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.7)"
                : undefined,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            my: 2,
          }}
        >
          <CoinIcon />
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.mode === "dark" ? "#FFFFFF" : undefined,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            Each dollar will be converted to 2 coins
          </Typography>

          <StyledTextField
            autoFocus
            label="Amount in Dollars"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 1 }}
            disabled={loading}
          />

          {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 215, 0, 0.1)"
                    : "rgba(184, 134, 11, 0.1)",
                padding: "8px 16px",
                borderRadius: "8px",
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255, 215, 0, 0.2)"
                    : "rgba(184, 134, 11, 0.2)"
                }`,
              }}
            >
              <MonetizationOnIcon
                sx={{
                  color: theme.palette.mode === "dark" ? "#FFD700" : "#B8860B",
                  fontSize: "1.2rem",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === "dark" ? "#FFD700" : "#B8860B",
                  fontWeight: 600,
                }}
              >
                You will receive {Number(amount) * 2} coins
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: theme.palette.mode === "dark" ? "#FFFFFF" : undefined,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : undefined,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDeposit}
          variant="contained"
          disabled={
            loading || !amount || isNaN(Number(amount)) || Number(amount) <= 0
          }
          sx={{
            backgroundColor:
              theme.palette.mode === "dark" ? "#FFD700" : "#B8860B",
            color: "#000000",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#FFE44D" : "#DAA520",
            },
            "&.Mui-disabled": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 215, 0, 0.3)"
                  : "rgba(184, 134, 11, 0.3)",
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Deposit"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default DepositDialog;
