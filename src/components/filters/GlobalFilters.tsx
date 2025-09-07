"use client";
import { getApplicationLocations } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POSSIBLE_APPLICATION_STATUSES } from "@/lib/constants";
import { useEffect, useState } from "react";

interface GlobalFiltersProps {
  onFilterChange: (filters: {
    status: string;
    location: string;
    dateRange: { from?: Date; to?: Date };
  }) => void;
  currentFilters: {
    status: string;
    location: string;
    dateRange: { from?: Date; to?: Date };
  };
}

export default function GlobalFilters({
  onFilterChange,
  currentFilters,
}: GlobalFiltersProps) {
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locations = await getApplicationLocations();
        setLocations(locations);
      } catch (error) {
        console.error("Failed to fetch application locations:", error);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = (value: string) => {
    const newStatus = value === "all" ? "" : value;
    setSelectedStatus(newStatus);
    onFilterChange({
      ...currentFilters,
      status: newStatus,
    });
  };

  const handleLocationChange = (value: string) => {
    const newLocation = value === "all" ? "" : value;
    setSelectedLocation(newLocation);
    onFilterChange({
      ...currentFilters,
      location: newLocation,
    });
  };

  const handleResetFilters = () => {
    setSelectedStatus("");
    setSelectedLocation("");
    onFilterChange({
      status: "",
      location: "",
      dateRange: { from: undefined, to: undefined },
    });
  };

  return (
    <div className="mb-4 flex items-center justify-end gap-4">
      <Select onValueChange={handleStatusChange} value={selectedStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className={undefined}>
          <SelectItem value="all" className={undefined}>
            All Statuses
          </SelectItem>
          {POSSIBLE_APPLICATION_STATUSES.map((status) => (
            <SelectItem key={status} value={status} className={undefined}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleLocationChange} value={selectedLocation}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent className={undefined}>
          <SelectItem value="all" className={undefined}>
            All Locations
          </SelectItem>
          {locations.map((location) => (
            <SelectItem key={location} value={location} className={undefined}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        onClick={handleResetFilters}
        className={undefined}
        size={undefined}
      >
        Reset Filters
      </Button>
    </div>
  );
}
