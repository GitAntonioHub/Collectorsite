package com.Collectorsite.Backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Removing the prefix configuration - controllers will define their own paths
    
    //@Override
    //public void configurePathMatch(PathMatchConfigurer configurer) {
    //    configurer.addPathPrefix("/api", c -> true);
    //}
} 