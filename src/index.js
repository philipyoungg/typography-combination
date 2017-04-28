import { compose, length, merge, head, keys, values, forEach } from "Ramda";
import schema from "./schema";
import view from "./view";
import handlers from "./handlers";
import { allCombination } from "./stateManipulation";

// State Initialization
// ==========================================

const initialCombinations = allCombination(schema);

const store = {
  state: {
    app: schema,
    activeComponent: compose(head, keys)(schema),
    combination: initialCombinations,
    totalPermutation: length(initialCombinations),
    activeCombinationIndex: null
  },

  // updateState :: {k: v} -> {k: v}
  updateState: obj => (store.state = merge(store.state, obj))
};

// Start App
// ==========================================

$(document).ready(() => {
  forEach(v => v(store, handlers))(values(view.render));
  $("#input-container").on(
    "touchstart",
    handlers.changeActiveCombinationIndex.bind(null, store, view)
  );
  $("#app").on("click", handlers.changeActiveComponent.bind(null, store, view));
  $("#app").addClass("loaded");

  // const tour = new Shepherd.Tour({
  //   defaults: {
  //     classes: 'shepherd-theme-arrows',
  //     scrollTo: true,
  //   },
  // })
  // tour.addStep('first', {
  //   title: 'Example Shepherd',
  //   text: 'Cool plugin.. but when i started using it inside a web application were the HTML structure is not that simple, it was hard to make the active places get highlighted because it is done with pure css classes. It used Intro.js instead.. Shepherd is great for simple sites with simple html structure',
  //   attachTo: '#input-container right',
  //   classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
  // })
  // tour.start()
});
