import { shallowMount } from "@vue/test-utils";
import ListView from "@/views/ListView.vue";
import Card from "@/components/Card.vue";

describe("ListView", () => {
  it("renders the Card components on first load", async () => {
    const wrapper = shallowMount(ListView);

    // Assert that no Card components are rendered initially
    expect(wrapper.findAllComponents(Card)).toHaveLength(0);

    // Trigger the component to load the Card components
    await wrapper.setData({ headlinesArr: [{}, {}, {}] });

    // Wait for Vue to update the rendered components
    await wrapper.vm.$nextTick();

    // Assert that the Card components are rendered
    expect(wrapper.findAllComponents(Card)).toHaveLength(3);
  });
});
