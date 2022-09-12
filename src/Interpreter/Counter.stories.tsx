import React from "react";
import { Story } from "@ladle/react";
import { Counter } from "./Counter";

export let Example: Story = () => <Counter />;

export let InitialCount: Story = () => <Counter initialValue={10} />;
