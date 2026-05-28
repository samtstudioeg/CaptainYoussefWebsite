'use client';

import React, {
    useState,
    useCallback,
    useMemo,
    useEffect,
    memo,
} from 'react';

import Image from 'next/image';

interface AppImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    fill?: boolean;
    sizes?: string;
    onClick?: () => void;
    fallbackSrc?: string;
    loading?: 'lazy' | 'eager';
    unoptimized?: boolean;
    objectFit?: 'cover' | 'contain';
    [key: string]: any;
}

const AppImage = memo(function AppImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    quality = 85,
    placeholder = 'empty',
    blurDataURL,
    fill = false,
    sizes,
    onClick,
    fallbackSrc = '/assets/images/no_image.png',
    loading = 'lazy',
    unoptimized = false,
    objectFit = 'cover',
    ...props
}: AppImageProps) {

    // =========================
    // States
    // =========================

    const [imageSrc, setImageSrc] =
        useState(src);

    const [hasError, setHasError] =
        useState(false);

    // =========================
    // Update image when src changes
    // =========================

    useEffect(() => {
        setImageSrc(src);
        setHasError(false);
    }, [src]);

    // =========================
    // External URLs
    // =========================

    const isExternalUrl = useMemo(
        () =>
            typeof imageSrc === 'string' &&
            imageSrc.startsWith('http'),
        [imageSrc]
    );

    const resolvedUnoptimized =
        unoptimized || isExternalUrl;

    // =========================
    // Error Handling
    // =========================

    const handleError = useCallback(() => {
        if (
            !hasError &&
            imageSrc !== fallbackSrc
        ) {
            setImageSrc(fallbackSrc);
            setHasError(true);
        }
    }, [
        hasError,
        imageSrc,
        fallbackSrc,
    ]);

    // =========================
    // Classes
    // =========================

    const imageClassName = useMemo(() => {
        const classes = [className];

        if (onClick) {
            classes.push(
                'cursor-pointer hover:opacity-90 transition-opacity duration-200'
            );
        }

        return classes
            .filter(Boolean)
            .join(' ');
    }, [
        className,
        onClick,
    ]);

    // =========================
    // Shared Props
    // =========================

    const imageProps = useMemo(() => {
        const baseProps: any = {
            src: imageSrc,
            alt,
            className: imageClassName,
            quality,
            placeholder,
            unoptimized:
                resolvedUnoptimized,
            onError: handleError,
            onClick,
        };

        if (priority) {
            baseProps.priority = true;
        } else {
            baseProps.loading = loading;
        }

        if (
            blurDataURL &&
            placeholder === 'blur'
        ) {
            baseProps.blurDataURL =
                blurDataURL;
        }

        return baseProps;
    }, [
        imageSrc,
        alt,
        imageClassName,
        quality,
        placeholder,
        blurDataURL,
        resolvedUnoptimized,
        priority,
        loading,
        handleError,
        onClick,
    ]);

    // =========================
    // Fill Image
    // =========================

    if (fill) {
        return (
            <div className="relative w-full h-full">
                <Image
                    {...imageProps}
                    fill
                    sizes={
                        sizes ||
                        '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    }
                    style={{
                        objectFit,
                    }}
                    {...props}
                />
            </div>
        );
    }

    // =========================
    // Standard Image
    // =========================

    return (
        <Image
            {...imageProps}
            width={width || 400}
            height={height || 300}
            sizes={sizes}
            style={{
                objectFit,
            }}
            {...props}
        />
    );
});

AppImage.displayName = 'AppImage';

export default AppImage;
