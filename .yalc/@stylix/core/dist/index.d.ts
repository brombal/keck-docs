/// <reference types="react" />
import * as CSS from "csstype";
import React from "react";
type CSSProperties = CSS.StandardPropertiesHyphen<number | string> & CSS.VendorPropertiesHyphen<number | string> & CSS.StandardProperties<number | string> & CSS.VendorProperties<number | string>;
// Generic utility types
type Override<T, U> = Omit<T, keyof U> & U;
/**
 * Utility type that extends T1 with T2, T3, T4, overriding any properties that are already defined in previous types.
 */
type Extends<T1, T2, T3 = unknown, T4 = unknown> = Override<Override<Override<T1, T2>, T3>, T4>;
// Gets optional keys of T
type OptionalKeys<T extends object> = {
    [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];
// Gets non-optional keys of T
type NonOptionalKeys<T extends object> = {
    [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T];
// Makes all keys of T optional if they can be undefined
type WithOptionalKeys<T extends object> = {
    [K in OptionalKeys<T>]?: T[K];
} & {
    [K in NonOptionalKeys<T>]: T[K];
};
// Takes an object of properties, and an object of new property names as keys and original prop names as values.
// Result is an object of new keys with types of the original props (including source properties that were not mapped).
// E.g. MappedProps<{ someProp: string, oldProp: number }, { newProp: 'oldProp' }> = { someProp: string; newProp: number; }
type MappedProperties<TSource extends object, TMap extends {
    [key: string]: keyof TSource;
}> = WithOptionalKeys<{
    [K in keyof TMap]: TSource[TMap[K]];
} & {
    [K in Exclude<keyof TSource, TMap[keyof TMap]>]: TSource[K];
}>;
// React utility types
/**
 * - An html element,
 * - A React function component that accepts a second ref parameter
 * - A React function component that is the result of React.forwardRef().
 */
type HtmlOrComponent = keyof React.JSX.IntrinsicElements | React.ForwardRefRenderFunction<any, any> | React.ForwardRefExoticComponent<any>;
/**
 * Gets the props of TComponent.
 */
type HtmlOrComponentProps<TComponent extends HtmlOrComponent> = TComponent extends keyof React.JSX.IntrinsicElements ? React.ComponentPropsWithoutRef<TComponent> : TComponent extends React.ForwardRefRenderFunction<infer R, infer P> ? P & React.RefAttributes<R> : TComponent extends React.ForwardRefExoticComponent<infer P> ? P : never;
// Stylix types
type StylixObject = Record<string, unknown>;
type StylixStyles = StylixObject | StylixObject[];
type StylixValue<T> = T | Array<T | "@">;
/**
 * All standard CSS properties, custom style props, and the $css prop.
 */
type StylixProps<TOverrideProps = unknown, TExtendsFromProps = unknown> = Extends<TExtendsFromProps, {
    /**
     * Additional styles.
     */
    $css?: any;
    /**
     * Disables Stylix for the current element.
     */
    $disabled?: boolean;
} & {
    [key in keyof CSSProperties]?: StylixValue<CSSProperties[key]>;
} & {
    [key in keyof StylixPropsExtensions]?: StylixValue<key extends keyof StylixPropsExtensions ? StylixPropsExtensions[key] : never>;
}, TOverrideProps>;
/**
 * Allows users to add custom props to Stylix components:
 *
 * declare module 'stylix' {
 *   interface StylixStyleProperties {
 *     ...
 *   }
 * }
 */
interface StylixPropsExtensions {
}
/**
 * Additional properties on the Stylix ($) component and its built-in html components.
 */
type StylixComponentMeta = {
    displayName?: string;
    __isStylix: true;
};
type Stylix$elProp<TComponent extends ComponentOrElement> = {
    /**
     * Specifies the element to render.
     */
    $el: TComponent;
};
type Stylix$elPropOptional<TComponent extends ComponentOrElement> = Partial<Stylix$elProp<TComponent>>;
type ComponentOrElement = React.ElementType | React.ReactElement | React.JSX.Element;
/**
 * Props for main Stylix component (<$>)
 * `TComponent` is determined automatically by the type of $el.
 * <$ $el={...}>...</$>
 */
type Stylix$Props<TComponent extends ComponentOrElement> = Stylix$elProp<TComponent> & (TComponent extends React.ElementType<infer P> ? Extends<P, StylixProps> : StylixProps & {
    [key: string]: any;
}); // & Record<string, any>
// & Record<string, any>
type Stylix$ComponentExtras = StylixComponentMeta & {
    [key in keyof React.JSX.IntrinsicElements]: React.FC<StylixProps<Omit<React.ComponentPropsWithRef<key>, "color" | "content" | "translate">> & {
        htmlContent?: string;
        htmlTranslate?: "yes" | "no";
    }>;
};
/**
 * Type of main Stylix component ($)
 */
interface Stylix$Component extends Stylix$ComponentExtras {
    /**
     * This is equivalent to React.FunctionComponent, but must be specified explicitly this way to allow
     * TComponent to be generic here and not directly on the Stylix$Component type, so that it can be inferred at the time
     * the component is used.
     */
    <TComponent extends React.ElementType | React.ReactElement>(props: Stylix$Props<TComponent>, context?: any): React.ReactElement<any, any> | null;
}
/**
 * Stylix plugin function context object
 */
type StylixPluginFunctionContext = StylixPublicContext & {
    hash: string | null;
};
/**
 * Stylix plugin interface
 */
interface StylixPlugin {
    name: string;
    type: "initialize" | "processStyles" | "preprocessStyles";
    plugin(ctx: StylixPluginFunctionContext, styles: any): any;
    before?: StylixPlugin;
    after?: StylixPlugin;
    atIndex?: number;
}
declare const customProps: (customProps: Record<string, any>) => StylixPlugin[];
declare const defaultPlugins: {
    merge$css: StylixPlugin;
    mediaArrays: StylixPlugin;
    propCasing: StylixPlugin;
    flattenNestedStyles: StylixPlugin;
    replace$$class: StylixPlugin;
    defaultPixelUnits: StylixPlugin;
    cleanStyles: StylixPlugin;
};
/**
 * Stylix context
 *
 * The <StylixProvider> wrapper represents an "instance" of Stylix - a configuration, set of plugins, and reference to
 * the <style> element where css is output. All nodes contained within a <StylixProvider> element will share this
 * Stylix instance's configuration.
 *
 * See the README for more details.
 */
// StylixProvider component props
type StylixProviderProps = {
    id?: string;
    devMode?: boolean;
    plugins?: StylixPlugin[] | StylixPlugin[][];
    styleElement?: HTMLStyleElement;
    media?: string[];
    ssr?: boolean;
    children: any;
};
// StylixContext object interface
type StylixContext = {
    id: string;
    devMode: boolean;
    media: string[] | undefined;
    plugins: StylixPlugin[];
    stylesheet?: CSSStyleSheet;
    styleElement?: HTMLStyleElement;
    styleCollector?: string[];
    rules: {
        [key: string]: {
            hash: string;
            rules: string[];
            refs: number;
        };
    };
    styleProps: Record<string, string>;
    ssr?: boolean;
    cleanupRequest?: number;
    requestApply: boolean;
};
type StylixPublicContext = Pick<StylixContext, "id" | "devMode" | "media" | "stylesheet" | "styleElement" | "styleProps">;
// Convenience wrapper hook that returns the current Stylix context
declare function useStylixContext(): StylixContext;
declare function StylixProvider({ id, devMode, plugins, styleElement, children, ssr }: StylixProviderProps): React.ReactElement;
declare function StyleElement(props: {
    styles: string[];
} & Partial<React.HTMLProps<HTMLStyleElement>>): React.JSX.Element;
declare function RenderServerStyles(props: Partial<React.HTMLProps<HTMLStyleElement>>): React.JSX.Element;
type StylixContext$0 = StylixPublicContext;
/**
 * Accepts a Stylix CSS object and returns a unique className based on the styles' hash.
 * The styles are registered with the Stylix context and will be applied to the document.
 * If `global` is false, provided styles will be nested within the generated classname.
 * Returns the className hash if enabled, or an empty string.
 */
declare function useStyles(styles: Record<string, any> | undefined, options?: {
    global?: boolean;
    disabled?: boolean;
    debugLabel?: string;
}): string;
declare function useKeyframes(keyframes: any, options?: {
    disabled?: boolean;
}): string;
declare function useGlobalStyles(styles: StylixStyles, options?: {
    disabled?: boolean;
}): string;
/**
 * Invokes `map` on each key/value pair in `object`. The key/value pair is deleted from the object and replaced by
 * merging in the object returned from `map`. Recursively descends into all object and array values.
 * The `map` function will receive the key, the value, the current object being mapped, and a context object.
 * The context object is a plain object that you can modify as needed. The value will persist to subsequent calls to
 * `map` on child properties of `value`.
 */
declare function mapObjectRecursive(object: any, map: (key: string | number, value: any, object: any, context: any) => Record<string | number, any> | undefined, context?: any): any;
/**
 * Invokes a callback for each key/value pair in `object`, and continues recursively on each value that is an array or a
 * plain object. Returns `object`.
 * The `cb` function will receive the key, the value, the current object being mapped, and a context object.
 * The context object is a plain object that you can modify as needed. The value will persist to subsequent calls to
 * `map` on child properties of `value`.
 */
declare function walkRecursive<T extends Record<string, any> = any>(object: T, cb: (key: string, value: any, currentObject: any, context: any) => void, context?: any): T;
interface StyleCollector {
    collect: (element: React.ReactElement) => React.ReactElement;
    render: React.FC<React.ComponentProps<"style">>;
    styles: string[];
}
declare const styleCollectorContext: React.Context<string[] | undefined>;
declare function createStyleCollector(): StyleCollector;
declare function classifyProps(props: any, knownProps: Record<string, string>): [
    any,
    any
];
declare function useClassifyProps(props: any): any[];
/**
 * A component that accepts Stylix props in addition to TProps (Stylix props override TProps).
 */
type StylixStyledComponentWithProps<TProps> = React.FC<Extends<TProps, StylixProps>> & StylixComponentMeta;
/**
 * A component that accepts Stylix props in addition to the props of TComponent (Stylix props override TComponent props).
 */
type StylixStyledComponent<TComponent extends HtmlOrComponent> = StylixStyledComponentWithProps<HtmlOrComponentProps<TComponent>>;
/**
 * Gets a union of all the props of TComponent that conflict with css style properties.
 */
type ConflictingStyleProps<TComponent extends HtmlOrComponent> = keyof StylixProps & keyof HtmlOrComponentProps<TComponent>;
/**
 * A map of props of TComponent that conflict with css style properties to the name of the prop that should be passed to the original component.
 */
type PropMap<TComponent extends HtmlOrComponent> = {
    [key: string]: ConflictingStyleProps<TComponent>;
};
/**
 * A 'styled' component collects all style props and reduces them to a className which it passes as a prop to the
 * component. The new component accepts all styled props in addition to the original props of the component.
 * By default, all style props are consumed as styles, so if the original component accepts a prop that conflicts with a style prop, it will not be received by the component.
 * If you want a style prop to be passed directly to the original component (and maintain TS types from the original component), you
 * can specify it in the propMap.
 * must specify them in the config. You can also specify props to map from one name to another, so that the
 * resulting styled component can accept a non-style-prop name that is renamed and passed to the original component
 * as the prop that might otherwise conflict with a style prop.
 */
declare function styled<TComponent extends HtmlOrComponent, TPropMap extends PropMap<TComponent> | undefined>(component: TComponent, /**
 * A style object to apply to the component.
 */
styleProps?: StylixProps, /**
 * A map of new props to accept and the associated prop name to pass to the original component.
 */
propMap?: TPropMap): React.FC<
// Props include the props of TComponent, overridden by all style props, overridden by the values of propMap mapped to the types of their corresponding keys
Extends<HtmlOrComponentProps<TComponent>, StylixProps, TPropMap extends PropMap<TComponent> ? MappedProperties<HtmlOrComponentProps<TComponent>, TPropMap> : object>> & StylixComponentMeta;
declare const Stylix: Stylix$Component;
export { StylixProps, StylixPropsExtensions, Stylix$Component, Stylix$elProp, Stylix$elPropOptional, Extends, MappedProperties, HtmlOrComponentProps, useStylixContext, StylixProvider, StyleElement, RenderServerStyles, StylixContext$0 as StylixContext, useStyles, useKeyframes, useGlobalStyles, defaultPlugins, customProps, StylixPlugin, StylixPluginFunctionContext, mapObjectRecursive, walkRecursive, createStyleCollector, styleCollectorContext, StyleCollector, classifyProps, useClassifyProps, styled, StylixStyledComponentWithProps, StylixStyledComponent, Stylix as default };
