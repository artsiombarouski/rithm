import React, {
  cloneElement,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { StyleProp, useWindowDimensions, View } from 'react-native';

import { SpotlightTourContext, TourStep } from '../../SpotlightTour.context';

export interface ChildProps<T> {
  /**
   * A React children, if any.
   */
  children?: ReactNode;
  /**
   * A React reference.
   */
  ref: RefObject<unknown>;
  /**
   * The style prop.
   */
  style: StyleProp<T>;
}

export interface AttachStepProps<T> {
  step: TourStep | string;
  /**
   * The element in which the spotlight will be to wrapped to in the specified
   * step of the tour.
   */
  children: ReactElement<ChildProps<T>>;
  /**
   * When `AttachStep` wraps a Functional Component, it needs to add an
   * aditional `View` on top of it to be able to measure the layout upon
   * render. This prop allows to define the behavior of the width of such
   * `View`. When set to `false`, it adjusts to its contents, when set to
   * `true`, it stretches out and tries to fill it view.
   *
   * **Note:** This prop has no effect when wrapping native components or
   * componentes created with `React.forwardRef`, which pass the `ref` to
   * another native component.
   *
   * @default false
   */
  fill?: boolean;
}

/**
 * React functional component used to attach and step to another component by
 * only wrapping it. Use its props to customize the behavior.
 *
 * @param props the component props
 * @returns an AttachStep React element
 */
export function AttachStep<T>({
  step,
  children,
  fill = false,
}: AttachStepProps<T>): ReactElement {
  const { currentStep, changeSpot } = useContext(SpotlightTourContext);

  const childRef = useRef<View>(null);
  const dimensions = useWindowDimensions();

  const measure = useCallback(() => {
    if (
      currentStep?.key ===
      (typeof step === 'string' ? step : (step as TourStep).key)
    ) {
      childRef.current?.measureInWindow((x, y, width, height) => {
        changeSpot({ height, width, x, y });
      });
    }
  }, [changeSpot, currentStep, step, dimensions.width, dimensions.height]);

  useEffect(measure, [
    changeSpot,
    currentStep,
    step,
    dimensions.width,
    dimensions.height,
  ]);
  useLayoutEffect(measure, [
    changeSpot,
    currentStep,
    step,
    dimensions.width,
    dimensions.height,
  ]);

  if (typeof children.type === 'function') {
    const { style, ...rest } = children.props;
    const childStyle = style ?? {};

    return (
      <View
        testID="attach-wrapper-view"
        ref={childRef}
        style={{ alignSelf: fill ? 'stretch' : 'flex-start', ...childStyle }}
        collapsable={false}
        focusable={false}
        onLayout={() => {
          measure();
        }}
      >
        {cloneElement(children, rest, children.props.children)}
      </View>
    );
  }

  return cloneElement(
    children,
    { ...children.props, ref: childRef },
    children.props?.children,
  );
}
