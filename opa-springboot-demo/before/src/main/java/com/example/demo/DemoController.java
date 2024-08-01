package com.example.demo;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;

@RestController
@RequestMapping("/object")
class DemoController {

    // storage.get(tenant).get(id) -> object
    private static Map<String, Map<String, Map<String, Object>>> storage;

    public DemoController() {
        storage = new HashMap<String, Map<String, Map<String, Object>>>();
    }

    private Map<String, Object> storageGet(String tenant, String id) {
        Map<String, Map<String, Object>> tenantStore = this.storage.get(tenant);
        if (tenantStore == null) {
            return null;
        }

        return tenantStore.get(id);
    }

    private void storagePut(String tenant, String id, Map<String, Object> value) {
        if (this.storage.get(tenant) == null) {
            this.storage.put(tenant, new HashMap<String, Map<String, Object>>());
        }

        this.storage.get(tenant).put(id, value);
    }

    private List<String> storageList(String tenant) {
        Map<String, Map<String, Object>> tenantStore = this.storage.get(tenant);
        if (tenantStore == null) {
            return new ArrayList<String>();
        }

        return new ArrayList<>(tenantStore.keySet());
    }

    private void storageDelete(String tenant, String id) {
        Map<String, Map<String, Object>> tenantStore = this.storage.get(tenant);
        if (tenantStore == null) {
            return;
        }

        tenantStore.remove(id);
    }

    @GetMapping
    List<String> findAll(
        @RequestHeader(value = "Demo-Tenant") String tenant,
        @RequestHeader(value = "Demo-User") String user
    ){
        return this.storageList(tenant);
    }

    @GetMapping(value = "/{id}")
    public Map<String, Object> findById(
        @PathVariable("id") String id,
        @RequestHeader(value = "Demo-Tenant") String tenant,
        @RequestHeader(value = "Demo-User") String user
    ) {
        Map<String, Object> result = this.storageGet(tenant, id);
        if (result == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "object not found");
        }
        return result;
    }

    @PutMapping(value = "/{id}")
    public void update(
        @PathVariable("id") String id,
        @RequestBody Map<String, Object> obj,
        @RequestHeader(value = "Demo-Tenant") String tenant,
        @RequestHeader(value = "Demo-User") String user
    ) {
        this.storagePut(tenant, id, obj);
    }

    @DeleteMapping(value = "/{id}")
    public void update(
        @PathVariable("id") String id,
        @RequestHeader(value = "Demo-Tenant") String tenant,
        @RequestHeader(value = "Demo-User") String user
    ) {
        this.storageDelete(tenant, id);
    }

}
