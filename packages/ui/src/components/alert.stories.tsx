import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Alert, AlertDescription, AlertTitle, AlertAction } from "./alert.js";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, CheckmarkCircle01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "./button.js";

const meta: Meta<typeof Alert> = {
  title: "Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    featured: true,
    docs: {
      description: {
        component: "A callout for displaying important information.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error", "info", "success", "warning"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Alert>
      <HugeiconsIcon icon={InformationCircleIcon} />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const WithIconAndActionButtons: Story = {
  render: () => (
    <Alert>
      <HugeiconsIcon icon={InformationCircleIcon} />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Accept
        </Button>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
      </AlertAction>
    </Alert>
  ),
};

export const Info: Story = {
  render: () => (
    <Alert variant="info">
      <HugeiconsIcon icon={InformationCircleIcon} />
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>
        This is an informational alert. It provides helpful context or guidance.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <HugeiconsIcon icon={CheckmarkCircle01Icon} />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <HugeiconsIcon icon={AlertCircleIcon} />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Please review your settings before proceeding.
      </AlertDescription>
    </Alert>
  ),
};

export const Error: Story = {
  render: () => (
    <Alert variant="error">
      <HugeiconsIcon icon={AlertCircleIcon} />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert>
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>This is a default alert.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <HugeiconsIcon icon={InformationCircleIcon} />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>This is an info alert.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <HugeiconsIcon icon={CheckmarkCircle01Icon} />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>This is a success alert.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <HugeiconsIcon icon={AlertCircleIcon} />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This is a warning alert.</AlertDescription>
      </Alert>
      <Alert variant="error">
        <HugeiconsIcon icon={AlertCircleIcon} />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>This is an error alert.</AlertDescription>
      </Alert>
    </div>
  ),
};
