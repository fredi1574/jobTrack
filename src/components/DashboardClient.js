"use client";
import { DialogTitle } from "@radix-ui/react-dialog";
import Link from "next/link";
import { useState } from "react";
import AddApplicationForm from "./AddApplicationForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import NoJobApplications from "./NoJobApplications";

const statusColors = {
  applied: "bg-sky-100 text-sky-500",
  interview: "bg-purple-100 text-purple-500",
  offer: "bg-green-100 text-green-500",
  rejected: "bg-red-100 text-red-500",
};

export default function DashboardClient({ initialApplications }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const applications = initialApplications;

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-10">
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">
          Your Job Applications
        </h1>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="cursor-pointer hover:bg-sky-200"
              variant="outline"
            >
              Add new Application
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] md:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add new Application</DialogTitle>
              <DialogDescription>
                Fill in the details for the job application you are applying for
              </DialogDescription>
            </DialogHeader>
            <AddApplicationForm onSuccess={handleModalClose} />
            <DialogFooter>
              <DialogClose className="cursor-pointer hover:underline">
                Cancel
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {applications.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            {/* thead */}
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Position
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  city
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Link
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className={`hover:bg-gray-100 dark:hover:bg-gray-800/50 ${
                    application.status.toLowerCase() === "offer"
                      ? "bg-green-100"
                      : application.status.toLowerCase() === "rejected"
                        ? "bg-red-100 text-red-500 line-through"
                        : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {application.company}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {application.position}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {application.city}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {new Date(application.appliedAt).toLocaleDateString(
                      "en-IL",
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {application.url}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                        statusColors[application.status.toLowerCase()]
                      }`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <Link
                      href={`/applications/${application.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <NoJobApplications />
      )}
    </div>
  );
}
