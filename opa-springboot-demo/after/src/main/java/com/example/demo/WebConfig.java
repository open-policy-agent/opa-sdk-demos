package com.example.demo;

import com.styra.opa.OPAClient;
import com.styra.opa.springboot.OPAAuthorizationManager;
import com.styra.opa.springboot.ContextDataProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.core.Authentication;
import jakarta.servlet.http.HttpServletRequest;

import java.util.function.Supplier;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class WebConfig{
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        String opaURL = "http://localhost:8181";
        String opaURLEnv = System.getenv("OPA_URL");
        if (opaURLEnv != null) {
            opaURL = opaURLEnv;
        }
        OPAClient opa = new OPAClient(opaURL);

        AuthorizationManager<RequestAuthorizationContext> am = new OPAAuthorizationManager(opa, "demo/main", customContextProvider());

        // NOTE: The `.csrf(...)` disables CSRF protections. This could
        // be a serious security vulnerability in a production environment.
        // However, since this API is intended for educational and development
        // purposes, it is disabled because it makes it easier to work with
        // locally. If you want to use any of this code for a production
        // service, it is important to re-enable CSRF protection.
        http.authorizeHttpRequests(authorize -> authorize
                .anyRequest().access(am)).csrf(csrf -> csrf.disable());

        return http.build();
    }

    private static ContextDataProvider customContextProvider() {
        return (Supplier<Authentication> authentication, RequestAuthorizationContext object) -> {
            // This method implements the ContextDataProvider interface for
            // OPA-SpringBoot. In this case, we simulate a scenario where certain
            // objects in the object store require special roles beyond read/writer
            // based on their prefix. Specifically, if an object ID is prefixed
            // with `accounting_`, we set `extra-roles` to `[accounting]`, and
            // similar if the object ID is prefxied with `legal_`. In a real-world
            // scenario, this function might instead do a database lookup, check a
            // config file, or call out to an external service to decide what extra
            // data to include.
            //
            // This information this function returns will end up in
            // `input.context.data` in the OPA policy.

            HttpServletRequest request = object.getRequest();
            String resourceId = request.getServletPath();

            Map<String, Object> extraData = new HashMap<String, Object>();
            List<String> extraRoles = new ArrayList<String>();

            if (resourceId.matches(".*/accounting_[^/]*")) {
                extraRoles.add("accounting");
            }

            if (resourceId.matches(".*/legal_[^/]*")) {
                extraRoles.add("legal");
            }

            extraData.put("extra-roles", extraRoles);
            return extraData;
        };
    }
}
