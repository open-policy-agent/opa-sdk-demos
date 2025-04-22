package com.example.demo;

import com.styra.opa.springboot.input.OPAInputContextCustomizer;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.styra.opa.springboot.input.InputConstants.CONTEXT_DATA;

@Configuration
public class OPAConfig {

    /**
     * We simulate a scenario where certain objects in the object store require special roles beyond reader/writer
     * based on their prefix. Specifically, if an object ID is prefixed with `accounting_`, we set `extra-roles` to
     * `[accounting]`, and similar if the object ID is prefxied with `legal_`. In a real-world scenario, this function
     * might instead do a database lookup, check a config file, or call out to an external service to decide what extra
     * data to include.
     * This information this function returns will end up in `input.context.data` in the OPA policy.
     */
    @Bean
    OPAInputContextCustomizer opaInputContextCustomizer() {
        return (Authentication authentication, RequestAuthorizationContext object, Map<String, Object> context) -> {
            HttpServletRequest request = object.getRequest();
            String resourceId = request.getServletPath();

            List<String> extraRoles = new ArrayList<>();
            if (resourceId.matches(".*/accounting_[^/]*")) {
                extraRoles.add("accounting");
            }
            if (resourceId.matches(".*/legal_[^/]*")) {
                extraRoles.add("legal");
            }
            Map<String, Object> data = Map.of("extra-roles", extraRoles);

            Map<String, Object> newContext = new HashMap<>(context);
            newContext.put(CONTEXT_DATA, data);
            return newContext;
        };
    }
}
