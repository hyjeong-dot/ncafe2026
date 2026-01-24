package com.new_cafe.app.backend.entity;

public class Menu {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private String image;
    private int category;

    public Menu() {
    }

    public Menu(Long id, String korName, String engName, String description, int price, String image, int category) {
        this.id = id;
        this.korName = korName;
        this.engName = engName;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKorName() {
        return korName;
    }

    public void setKorName(String korName) {
        this.korName = korName;
    }

    public String getEngName() {
        return engName;
    }

    public void setEngName(String engName) {
        this.engName = engName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Menu [id=" + id + ", korName=" + korName + ", engName=" + engName + ", description=" + description
                + ", price=" + price + ", image=" + image + "]";
    }
}
