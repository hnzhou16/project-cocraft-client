"use server";

import {authService} from "@/services";
import {ActivatePayload} from "@/types";

export async function activateAction(token: string): Promise<{ success: boolean; error: string }> {
  if (!token) {
    return {success: false, error: "Missing activation token."};
  }

  try {
    const payload: ActivatePayload = {token};
    await authService.activate(payload);

    return {success: true, error: ""};
  } catch (error) {
    console.error(error);
    return {success: false, error: "Unexpected error occurred while activating account."};
  }
}