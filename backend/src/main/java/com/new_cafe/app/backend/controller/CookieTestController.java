package com.new_cafe.app.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.CookieValue;

@Controller
@RequestMapping("/cookie")
public class CookieTestController {

    @GetMapping("/test")
    public String cookieTest(@CookieValue(name = "age", required = false) String age, HttpServletRequest request, Model model) { //controller

        // Cookie[] cookies = request.getCookies();
        // if (cookies != null) {
        //     for (Cookie cookie : cookies) {
        //         System.out.println("쿠키 이름: " + cookie.getName());
        //         System.out.println("쿠키 값: " + cookie.getValue());
        //     }
        // }
        // 데이터(modal)를 마련하고
        model.addAttribute("name", "홍길동");
        model.addAttribute("age", age);

        HttpSession session = request.getSession();
        String sessionName = (String) session.getAttribute("name");
        String sessionAge = (String) session.getAttribute("age");
        
        model.addAttribute("sessionName", sessionName);
        model.addAttribute("sessionAge", sessionAge);

        return "test"; //view, templates 폴더의 test.html을 찾아서 리턴
    }

    @GetMapping("/create")
    public String createCookie(Model model) {
        return "create";
    }

    @PostMapping("/create")
    public String createCookie(String name, String value, HttpServletResponse response) {

        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/cookie");
        response.addCookie(cookie);
        
        return "redirect:/cookie/test";
    }

    @GetMapping("/session/create")
    public String createSession(Model model) {
        return "create";
    }

    @PostMapping("/session/create")
    public String createSession(String name, String value, HttpServletRequest request) {

        HttpSession session = request.getSession();
        session.setAttribute(name, value);
        
        return "redirect:/cookie/test";
    }
}