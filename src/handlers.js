import { assocPath, of, merge, length } from 'Ramda';
import { stringToArray } from './helpers';
import { allCombination, convertToSchema } from './stateManipulation';


// Event Handlers
// ==========================================

const handlers = {
  userInput(store, view, e) {
    Rx.Observable.fromEvent($('input'), 'change')
      .map(e => $(e).attr())
    const { state, updateState } = store;
    const inputVal = $(e.currentTarget).val();
    const prop = $(e.currentTarget).attr('name');
    const value = prop === 'text' ? of(inputVal) : stringToArray(inputVal);
    const stateWithNewProps = assocPath(['app', state.activeComponent, 'properties', prop], value)(state);
    const newCombination = allCombination(stateWithNewProps.app);
    const newState = merge(stateWithNewProps, {
      combination: newCombination,
      totalPermutation: length(newCombination),
    });
    updateState(newState);
    view.render.activeCombination(store, handlers);
    view.render.combination(store, handlers);
  },

  changeActiveComponent(store, view, e) {
    const { state, updateState } = store;
    const selectedComponentName = $(e.currentTarget).attr('component-name');

    if (state.activeComponent !== selectedComponentName) {
      if (e.target.className !== 'typography-identifier__select') {   // SUPER HACK.
        updateState({
          activeComponent: selectedComponentName,
        });
        view.update.activeComponent(store, handlers);
        view.render.activeCombination(store, handlers);
        view.render.input(store, handlers);
      }
    }
    e.stopPropagation();
  },

  changeActiveCombinationIndex(store, view, e) {
    const typographyIndex = $(e.currentTarget).attr('combination-index');
    store.updateState({
      activeCombinationIndex: e.type === 'mouseleave' ? null : typographyIndex,
    });
    view.update.activeInputItem(store, handlers);
  },

  reduceToOneCombination(store, view, e) {
    const { state, updateState } = store;
    const typographyIndex = $(e.currentTarget).attr('combination-index');
    if (state.totalPermutation > 1) {
      $('#app').removeClass('loaded');
      $('#input-container').removeClass('loaded');
      $('#credits').removeClass('loaded');
      const newApp = convertToSchema(state.combination[typographyIndex]);
      const newCombination = allCombination(newApp);
      updateState({
        totalPermutation: 1,
        activeCombinationIndex: 0,
        app: newApp,
        combination: newCombination,
      });
      setTimeout(() => {
        $('#inputs').removeClass('loaded');
      }, 200);
      setTimeout(() => {
        view.render.combination(store, handlers);
        view.render.activeCombination(store, handlers);
        view.render.input(store, handlers);
        $('#app').addClass('loaded');
        $('#input-container').addClass('loaded');
        $('#credits').addClass('loaded');
      }, 400);
    }
  },
};

export default handlers;
