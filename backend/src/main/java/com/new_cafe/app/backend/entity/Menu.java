package com.new_cafe.app.backend.entity;

public class Menu {
    private Long id;
    private String korName;
    private String engName;
    private String description;
    private int price;
    private String image;
    private int categoryId;
    private java.sql.Timestamp createdAt;
    private java.sql.Timestamp updatedAt;

    private Category category;
    // private List<MenuImage> images;

    public Menu() {
    }

    public Menu(Long id, String korName, String engName, String description, int price, String image, int categoryId,
            java.sql.Timestamp createdAt, java.sql.Timestamp updatedAt) {
        this.id = id;
        this.korName = korName;
        this.engName = engName;
        this.description = description;
        this.price = price;
        this.image = image;
        this.categoryId = categoryId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public java.sql.Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.sql.Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Menu [id=" + id + ", korName=" + korName + ", engName=" + engName + ", description=" + description
                + ", price=" + price + ", image=" + image + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
                + "]";
    }
}
