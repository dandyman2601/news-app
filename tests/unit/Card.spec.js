import { shallowMount } from "@vue/test-utils";
import Card from "@/components/Card.vue";

describe("Card", () => {
  it("checks if the title length exceeds 255 characters", () => {
    const wrapper = shallowMount(Card, {
      propsData: {
        articleData: {
          title:
            "This is a very long title that exceeds 255 characters and should fail the validation.",
        },
      },
    });

    // Find the v-text-field component
    const textFieldWrapper = wrapper.findComponent({ name: "v-text-field" });

    textFieldWrapper.setValue("A".repeat(255));

    // Get the value of the v-model binding (editedTitle)
    const editedTitle = textFieldWrapper.vm.editedTitle;

    // Check if the title length exceeds 255 characters
    const isTitleLengthExceeded = editedTitle.length > 255;

    // Assert that the title length exceeds 255 characters
    expect(isTitleLengthExceeded).toBe(true);
  });
});
