import { useState, useCallback } from "react";

export type Period = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export const useFilterSoldProducts = (initialPeriod: Period = "daily") => {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleChangePeriod = useCallback((value: Period) => {
    setPeriod(value);
    const now = new Date();
    if (value === "daily") {
      setStartDate(now);
      setEndDate(now);
    } else if (value === "monthly") {
      setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59));
    } else if (value === "yearly") {
      setStartDate(new Date(now.getFullYear(), 0, 1));
      setEndDate(new Date(now.getFullYear(), 11, 31, 23, 59, 59));
    } else if (value === "custom") {
      setStartDate(now);
      setEndDate(now);
    }
  }, []);

  const handleChangeStartDate = useCallback((date: Date) => {
    setStartDate(date);
  }, []);

  const handleChangeEndDate = useCallback((date: Date) => {
    setEndDate(date);
  }, []);

  return {
    period,
    startDate,
    endDate,
    setPeriod,
    setStartDate,
    setEndDate,
    handleChangePeriod,
    handleChangeStartDate,
    handleChangeEndDate,
  };
};
