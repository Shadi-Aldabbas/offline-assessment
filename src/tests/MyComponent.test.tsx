import { render, screen, fireEvent } from "@testing-library/react";
import { useSavePin } from "../api/apiService";
import "@testing-library/jest-dom";
import MyComponent from "../components/MyComponent";

// Mock the `useSavePin` hook to control its behavior in the tests
jest.mock("../api/apiService");

const mockMutate = jest.fn();

describe("MyComponent", () => {
  beforeEach(() => {
    
    jest.clearAllMocks();

    (useSavePin as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isError: false,
      error: null,
      data: null,
    });
  });

  it("displays an error message for an invalid PIN", () => {
    render(<MyComponent />);
    const input = screen.getByLabelText("PIN");

    // Test same number
    fireEvent.change(input, { target: { value: "1111" } });
    expect(screen.getByText("digits can't be all the same, or sequential")).toBeInTheDocument();

    // Test sequential number
    fireEvent.change(input, { target: { value: "1234" } });
    expect(screen.getByText("digits can't be all the same, or sequential")).toBeInTheDocument();
  });

  it("enables the button for a valid PIN and no error message appears", () => {
    render(<MyComponent />);
    const input = screen.getByLabelText("PIN");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    fireEvent.change(input, { target: { value: "1357" } });
    expect(submitButton).toBeEnabled();
    expect(screen.queryByText("digits can't be all the same, or sequential")).not.toBeInTheDocument();
  });

  it("disables the button for an incomplete PIN", () => {
    render(<MyComponent />);
    const input = screen.getByLabelText("PIN");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    fireEvent.change(input, { target: { value: "123" } });
    expect(submitButton).toBeDisabled();
  });

  it("calls mutate with the correct PIN on submit", () => {
    render(<MyComponent />);
    const input = screen.getByLabelText("PIN");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    fireEvent.change(input, { target: { value: "1357" } });
    fireEvent.click(submitButton);

    expect(mockMutate).toHaveBeenCalledWith(1357);
  });

  it("shows a success message if responseData is returned", () => {
    (useSavePin as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isError: false,
      error: null,
      data: { message: "PIN saved successfully!" },
    });

    render(<MyComponent />);

    expect(screen.getByText("PIN saved successfully!")).toBeInTheDocument();
  });
});
