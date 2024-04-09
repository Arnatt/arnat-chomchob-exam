import { Builder, Browser, By, Key, until } from 'selenium-webdriver';
import assert from 'assert';

describe('Test Nejavu website', () => {
    let driver
    let vars
    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build()
        await driver.get("https://www.nejavu.com/");
        vars = {}
    })
    afterEach(async function () {
        await driver.quit();
    })

    it('Open the Nejavu website', async function () {
        // await driver.get("https://www.nejavu.com/");
        await driver.manage().window().maximize();
        try {
            await driver.findElement(By.xpath("//a[@class='close-modal']")).click();
        } catch (error) {
            console.log(error);
        }
        await driver.findElement(By.xpath("//div[@class='dn db-lg rel z-2']//li[3]//a[1]")).click();


        // Get Book Titles
        const bookTitles = [];
        for (let i = 1; i < 6; i++) {
            const xpath = "(//h5[@class='detail-title'])[" + i + "]";
            const item = await driver.findElement(By.xpath(xpath)).getText();
            bookTitles.push(item);
        }


        // Add Book To Cart
        await driver.sleep(5000);
        const element = await driver.findElement(By.css("div[class='bg-white book-list'] div:nth-child(6) div:nth-child(1) div:nth-child(1) div:nth-child(1) a:nth-child(1) img:nth-child(1)"));
        await driver.actions().scroll(0, 0, 0, 0, element).perform();
        await driver.sleep(5000);

        for (let addBook = 1; addBook < 6; addBook++) {
            let bookXpath = "(//button[@id='quick-cart-button'])[" + addBook + "]";
            await driver.sleep(2000);
            await driver.findElement(By.xpath(bookXpath)).click();
        }

        // View Cart
        await driver.sleep(3000);
        await driver.findElement(By.xpath("(//div[@class='nev-noti-icon']//img)[2]")).click();
        await driver.sleep(5000);


        //Varify Book Titles
        //Get Book Titles in Cart
        const bookInCart = [];
        for (let i = 2; i < bookTitles.length + 1; i++) {
            const locator = "body > main:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(" + i + ") > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)"
            const item = await driver.findElement(By.css(locator)).getText();
            bookInCart.push(item);
        }

        //Assert Book Titles
        for (let i = 0; i < bookInCart.length; i++) {
            assert.strictEqual(bookInCart[i].toString(), bookTitles[i].toString());
        }

        //Delete Book in Cart
        for (let deleteBook = 1; deleteBook < 6; deleteBook++) {
            let deleteXpath = "(//a[@class='delete-item']//img)[1]";
            await driver.sleep(2000);
            await driver.findElement(By.xpath(deleteXpath)).click();
            await driver.sleep(5000);
            await driver.findElement(By.xpath("//button[text()='ใช่ ลบรายการ']")).click();
            await driver.sleep(5000);
        }

        // //Check badge = 0
        const badge = await driver.findElement(By.id("badge-cart")).getText();
        assert.strictEqual(badge, "0");

    });
});