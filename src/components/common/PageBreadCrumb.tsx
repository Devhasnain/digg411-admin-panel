import { Link } from "react-router";
import Button from "../ui/button/Button";
import { ReactNode } from "react";

interface BreadcrumbProps {
  pageTitle: string;
  button?: boolean;
  buttonTitle?:string;
  buttonProps?: {
    size?: "sm" | "md"; // Button size
    variant?: "primary" | "outline"; // Button variant
    startIcon?: ReactNode; // Icon before the text
    endIcon?: ReactNode; // Icon after the text
    onClick?: () => void; // Click handler
    disabled?: boolean; // Disabled state
    className?: string; // Disabled state
    loading?: boolean;
  };
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  button,
  buttonProps,
  buttonTitle
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      {button ? (
        <Button {...buttonProps} size="sm">
          {buttonTitle}
        </Button>
      ) : (
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                to="/"
              >
                Home
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">
              {pageTitle}
            </li>
          </ol>
        </nav>
      )}
    </div>
  );
};

export default PageBreadcrumb;
