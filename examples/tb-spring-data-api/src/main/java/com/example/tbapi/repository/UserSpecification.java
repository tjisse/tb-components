package com.example.tbapi.repository;

import com.example.tbapi.dto.StringFilter;
import com.example.tbapi.dto.UserFilter;
import com.example.tbapi.model.Role;
import com.example.tbapi.model.User;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class UserSpecification {

    public static Specification<User> fromFilter(UserFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.name() != null) {
                addStringPredicate(predicates, root.get("name"), filter.name(), cb);
            }
            if (filter.email() != null) {
                addStringPredicate(predicates, root.get("email"), filter.email(), cb);
            }
            if (filter.role() != null) {
                addRolePredicate(predicates, root.get("role"), filter.role(), cb);
            }
            if (filter.address() != null) {
                if (filter.address().city() != null) {
                    addStringPredicate(predicates, root.get("address").get("city"), filter.address().city(), cb);
                }
                if (filter.address().street() != null) {
                    addStringPredicate(predicates, root.get("address").get("street"), filter.address().street(), cb);
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void addStringPredicate(List<Predicate> predicates, Path<String> path, StringFilter filter, CriteriaBuilder cb) {
        if (filter.eq() != null && !filter.eq().isBlank()) {
            predicates.add(cb.equal(path, filter.eq()));
        }
        if (filter.contains() != null && !filter.contains().isBlank()) {
            predicates.add(cb.like(cb.lower(path), "%" + filter.contains().toLowerCase() + "%"));
        }
        if (filter.in() != null && !filter.in().isEmpty()) {
            predicates.add(path.in(filter.in()));
        }
    }

    private static void addRolePredicate(List<Predicate> predicates, Path<Role> path, StringFilter filter, CriteriaBuilder cb) {
        if (filter.eq() != null && !filter.eq().isBlank()) {
            predicates.add(cb.equal(path, Role.fromDisplayValue(filter.eq())));
        }
        if (filter.in() != null && !filter.in().isEmpty()) {
            List<Role> roles = filter.in().stream()
                    .map(Role::fromDisplayValue)
                    .collect(Collectors.toList());
            predicates.add(path.in(roles));
        }
    }
}
