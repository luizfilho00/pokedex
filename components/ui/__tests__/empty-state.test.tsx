import { Image } from "react-native";
import { render } from "@testing-library/react-native";
import { EmptyState } from "../empty-state";

describe("EmptyState", () => {
  const mockImage = require("@/assets/images/magikarp.png");

  it("should render with correct title and message", () => {
    const { getByText } = render(
      <EmptyState
        title="No Pokémon found"
        message="Try searching with a different name"
        image={mockImage}
      />
    );

    expect(getByText("No Pokémon found")).toBeTruthy();
    expect(getByText("Try searching with a different name")).toBeTruthy();
  });

  it("should render image with correct source", () => {
    const { UNSAFE_getByType } = render(
      <EmptyState
        title="No results"
        message="Try again"
        image={mockImage}
      />
    );

    const image = UNSAFE_getByType(Image);
    expect(image.props.source).toBe(mockImage);
  });

  it("should apply className prop correctly", () => {
    const { getByText } = render(
      <EmptyState
        title="Test Title"
        message="Test Message"
        image={mockImage}
        className="custom-class"
      />
    );

    const titleElement = getByText("Test Title");
    expect(titleElement).toBeTruthy();
  });

  it("should match snapshot", () => {
    const tree = render(
      <EmptyState
        title="No Pokémon found"
        message="Try searching with a different name or National Pokédex number"
        image={mockImage}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
