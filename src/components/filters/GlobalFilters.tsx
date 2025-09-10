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
import { POSSIBLE_APPLICATION_STATUSES, STATUS_ICONS } from "@/lib/constants";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

interface GlobalFiltersProps {
  onFilterChange: (filters: {
    status: string;
    location: string;
    searchTerm: string;
  }) => void;
  currentFilters: {
    status: string;
    location: string;
    searchTerm: string;
  };
}

export default function GlobalFilters({
  onFilterChange,
  currentFilters,
}: GlobalFiltersProps) {
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange({
      ...currentFilters,
      searchTerm: value,
    });
  };

  const handleResetFilters = () => {
    setSelectedStatus("");
    setSelectedLocation("");
    setSearchTerm("");
    onFilterChange({
      status: "",
      location: "",
      searchTerm: "",
    });
  };

  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
      <div className="relative w-full sm:w-64 md:w-72">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search applications..."
          className="pl-10"
          value={searchTerm}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleSearchChange(event.target.value)
          }
        />
      </div>
      <Select onValueChange={handleStatusChange} value={selectedStatus}>
        <SelectTrigger className="w-full sm:w-[180px]">
          {selectedStatus ? (
            <div className="flex items-center">
              {STATUS_ICONS[selectedStatus.toLowerCase()]}
              <SelectValue placeholder="Status">{selectedStatus}</SelectValue>
            </div>
          ) : (
            <SelectValue placeholder="Status" />
          )}
        </SelectTrigger>
        <SelectContent className={undefined}>
          <SelectItem value="all" className={undefined}>
            All Statuses
          </SelectItem>
          {POSSIBLE_APPLICATION_STATUSES.map((status) => (
            <SelectItem key={status} value={status} className={undefined}>
              <div className="flex items-center">
                {STATUS_ICONS[status.toLowerCase()]}
                {status}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleLocationChange} value={selectedLocation}>
        <SelectTrigger className="w-full sm:w-[180px]">
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
        variant="secondary"
        onClick={handleResetFilters}
        className="w-full sm:w-auto"
        size={undefined}
      >
        Reset Filters
      </Button>
    </div>
  );
}
