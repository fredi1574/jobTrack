import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-card mx-auto max-w-3xl rounded-lg p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Privacy Policy
        </h1>

        <div className="prose prose-lg text-gray-700 dark:text-gray-300">
          <p>
            This Privacy Policy explains how we collect, use, and protect your
            personal information when you use our job tracking application.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
            What data we collect
          </h2>
          <p>
            When you sign up for our service, we collect the following
            information from your Google account:
          </p>
          <ul className="text-gray-700 dark:text-gray-300">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your profile picture</li>
          </ul>
          <p>
            We also request permission to access your Google Calendar to help
            you manage your job interview schedules.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
            How we use the data
          </h2>
          <p>
            We use the access to your Google Calendar solely for the purpose of
            creating, reading, and managing job interview events at your
            request. We do not access your calendar for any other purpose.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
            Data Sharing
          </h2>
          <p>
            We do not share your personal data or calendar information with any
            third parties. Your information is kept private and is only used to
            provide you with the intended functionalities of our application.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
            Contact Information
          </h2>
          <p>
            If you have any questions or concerns about our Privacy Policy or
            how we handle your data, please contact us at:
          </p>
          <p>
            <Link
              href="mailto:fredi1574@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Fredi1574@gmail.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
