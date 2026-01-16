import { useMemo, useState } from "react";
import { useI18n } from "../i18n";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function toNumber(value) {
  if (value == null) return 0;
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function clampNonNegative(n) {
  return n < 0 ? 0 : n;
}

export default function RoiCalculator({ dense = false }) {
  const { locale } = useI18n();

  const [pagesPerMonth, setPagesPerMonth] = useState("500");
  const [minutesManualPerPage, setMinutesManualPerPage] = useState("5");
  const [minutesReviewPerPage, setMinutesReviewPerPage] = useState("0.5");
  const [hourlyCost, setHourlyCost] = useState("35");
  const [monthlyPlan, setMonthlyPlan] = useState("149");

  const fmtCurrency = useMemo(() => {
    const lang = String(locale).toLowerCase().startsWith("pt") ? "pt-BR" : "en-US";
    // Pricing examples across the site are BRL; keep consistent.
    return new Intl.NumberFormat(lang, { style: "currency", currency: "BRL" });
  }, [locale]);

  const fmtNumber = useMemo(() => {
    const lang = String(locale).toLowerCase().startsWith("pt") ? "pt-BR" : "en-US";
    return new Intl.NumberFormat(lang, { maximumFractionDigits: 2 });
  }, [locale]);

  const computed = useMemo(() => {
    const pages = clampNonNegative(toNumber(pagesPerMonth));
    const manualMin = clampNonNegative(toNumber(minutesManualPerPage));
    const reviewMin = clampNonNegative(toNumber(minutesReviewPerPage));
    const hourly = clampNonNegative(toNumber(hourlyCost));
    const plan = clampNonNegative(toNumber(monthlyPlan));

    const manualHoursMonth = (pages * manualMin) / 60;
    const reviewHoursMonth = (pages * reviewMin) / 60;

    const manualCostMonth = manualHoursMonth * hourly;
    const ocrCostMonth = plan + reviewHoursMonth * hourly;

    const manualCostYear = manualCostMonth * 12;
    const ocrCostYear = ocrCostMonth * 12;

    const savingsMonth = manualCostMonth - ocrCostMonth;
    const savingsYear = manualCostYear - ocrCostYear;

    const roi = ocrCostYear > 0 ? (savingsYear / ocrCostYear) * 100 : null;

    const paybackMonths = savingsMonth > 0 ? plan / savingsMonth : null;

    return {
      pages,
      manualHoursMonth,
      reviewHoursMonth,
      manualCostMonth,
      ocrCostMonth,
      manualCostYear,
      ocrCostYear,
      savingsMonth,
      savingsYear,
      roi,
      paybackMonths,
    };
  }, [hourlyCost, minutesManualPerPage, minutesReviewPerPage, monthlyPlan, pagesPerMonth]);

  function reset() {
    setPagesPerMonth("500");
    setMinutesManualPerPage("5");
    setMinutesReviewPerPage("0.5");
    setHourlyCost("35");
    setMonthlyPlan("149");
  }

  const spacing = dense ? 1.5 : 2;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, my: 2 }}>
      <CardContent>
        <Stack spacing={spacing}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              ROI Calculator
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Estimate cost difference between manual typing and an OCR + review workflow.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Pages / month"
                value={pagesPerMonth}
                onChange={(e) => setPagesPerMonth(e.target.value)}
                fullWidth
                inputMode="numeric"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Typing minutes / page"
                value={minutesManualPerPage}
                onChange={(e) => setMinutesManualPerPage(e.target.value)}
                fullWidth
                inputMode="decimal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Review minutes / page"
                value={minutesReviewPerPage}
                onChange={(e) => setMinutesReviewPerPage(e.target.value)}
                fullWidth
                inputMode="decimal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Hourly cost"
                value={hourlyCost}
                onChange={(e) => setHourlyCost(e.target.value)}
                fullWidth
                inputMode="decimal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="OCR plan / month"
                value={monthlyPlan}
                onChange={(e) => setMonthlyPlan(e.target.value)}
                fullWidth
                inputMode="decimal"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex", alignItems: "center" }}>
              <Button variant="text" onClick={reset} sx={{ textTransform: "none" }}>
                Reset
              </Button>
            </Grid>
          </Grid>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    Monthly
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Manual hours: {fmtNumber.format(computed.manualHoursMonth)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Review hours: {fmtNumber.format(computed.reviewHoursMonth)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manual cost: {fmtCurrency.format(computed.manualCostMonth)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      OCR cost: {fmtCurrency.format(computed.ocrCostMonth)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 900, mt: 0.5 }}>
                      Savings: {fmtCurrency.format(computed.savingsMonth)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    Annual
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Manual cost / year: {fmtCurrency.format(computed.manualCostYear)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      OCR cost / year: {fmtCurrency.format(computed.ocrCostYear)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 900, mt: 0.5 }}>
                      Savings / year: {fmtCurrency.format(computed.savingsYear)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      ROI: {computed.roi == null ? "—" : `${fmtNumber.format(computed.roi)}%`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Payback: {computed.paybackMonths == null || !Number.isFinite(computed.paybackMonths)
                        ? "—"
                        : `${fmtNumber.format(computed.paybackMonths)} months`}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="caption" color="text.secondary">
            Notes: this is a simple estimate. Measure typing and review times using a representative sample.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
