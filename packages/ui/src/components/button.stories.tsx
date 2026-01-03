import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "./button.js";
import { ArrowUp, ArrowUpRight, Circle } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    featured: true,
    docs: {
      description: {
        component: "A button or a component that looks like a button.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "destructive-outline", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "xl", "icon", "icon-xs", "icon-sm", "icon-lg", "icon-xl"],
    },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

export const DestructiveOutline: Story = {
  args: {
    variant: "destructive-outline",
    children: "Delete",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

export const ExtraSmallSize: Story = {
  args: {
    size: "xs",
    children: "Extra Small",
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const ExtraLargeSize: Story = {
  args: {
    size: "xl",
    children: "Extra Large",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const Icon: Story = {
  render: () => (
    <Button variant="outline" size="icon" aria-label="Arrow up">
      <ArrowUp />
    </Button>
  ),
};

export const IconExtraSmallSize: Story = {
  render: () => (
    <Button variant="outline" size="icon-xs" aria-label="Arrow up">
      <ArrowUp />
    </Button>
  ),
};

export const IconSmallSize: Story = {
  render: () => (
    <Button variant="outline" size="icon-sm" aria-label="Arrow up">
      <ArrowUp />
    </Button>
  ),
};

export const IconLargeSize: Story = {
  render: () => (
    <Button variant="outline" size="icon-lg" aria-label="Arrow up">
      <ArrowUp />
    </Button>
  ),
};

export const IconExtraLargeSize: Story = {
  render: () => (
    <Button variant="outline" size="icon-xl" aria-label="Arrow up">
      <ArrowUp />
    </Button>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Button variant="outline" size="sm">
      <ArrowUpRight data-icon="inline-start" />
      New Branch
    </Button>
  ),
};

export const WithLink: Story = {
  render: () => (
    <Button render={<a href="/login" />}>Login</Button>
  ),
};

export const Loading: Story = {
  render: () => (
    <Button size="sm" variant="outline" disabled>
      <svg aria-hidden viewBox="0 0 24 24" className="animate-spin size-4 inline-block" data-icon="inline-start" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20" />
        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      Submit
    </Button>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="destructive-outline">Destructive Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
