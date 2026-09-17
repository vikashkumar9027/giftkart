import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
    ListFlowable,
    ListItem
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Running Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(46, A4[1] - 32, "FINAL YEAR PROJECT SYNOPSIS  |  DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING")
            self.drawRightString(A4[0] - 46, A4[1] - 32, "PROJECT: GIFTKART")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.6)
            self.line(46, A4[1] - 36, A4[0] - 46, A4[1] - 36)

        # Running Footer
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.6)
        self.line(46, 38, A4[0] - 46, 38)
        
        self.drawString(46, 26, "Confidential — For Academic Evaluation & Final Year Review Only")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 46, 26, page_str)
        self.restoreState()


def create_synopsis_pdf(output_filename):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=A4,
        leftMargin=46,
        rightMargin=46,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    primary_color = colors.HexColor("#0F2942")     # Deep Corporate Navy
    secondary_color = colors.HexColor("#991B1B")   # Academic Maroon/Crimson
    text_color = colors.HexColor("#1E293B")        # Slate 800
    muted_color = colors.HexColor("#475569")       # Slate 600
    border_color = colors.HexColor("#CBD5E1")      # Slate 300
    table_bg = colors.HexColor("#F8FAFC")          # Slate 50
    header_bg = colors.HexColor("#0F2942")         # Slate 900
    
    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        alignment=1, # Center
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=secondary_color,
        alignment=1,
        spaceAfter=12
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    sub_section_heading = ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=secondary_color,
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=text_color,
        spaceAfter=6,
        alignment=4 # Justified
    )

    meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=primary_color
    )

    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=text_color
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=text_color
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=primary_color
    )

    story = []

    # --- HEADER / TITLE BLOCK ---
    story.append(Paragraph("PROJECT SYNOPSIS", subtitle_style))
    story.append(Paragraph("GiftKart: An Intelligent Multi-Vendor Gifting &amp; E-Commerce Platform", title_style))
    story.append(Paragraph("Full-Stack Web Development | MERN Architecture (MongoDB, Express.js, React.js, Node.js)", ParagraphStyle(
        'TechLine', fontName='Helvetica-Bold', fontSize=9.5, leading=13, textColor=muted_color, alignment=1, spaceAfter=10
    )))

    # Metadata Grid (Academic Submission Details)
    meta_data = [
        [Paragraph("Project Title:", meta_label), Paragraph("GiftKart — Scalable Multi-Vendor Gifting Store &amp; Admin CMS", meta_val),
         Paragraph("Academic Year:", meta_label), Paragraph("2025 – 2026 (Final Year Major Project)", meta_val)],
        [Paragraph("Domain / Track:", meta_label), Paragraph("Full-Stack Web Technologies &amp; Distributed Systems", meta_val),
         Paragraph("Degree / Branch:", meta_label), Paragraph("B.Tech / B.E. / BCA / MCA (Computer Science / IT)", meta_val)],
        [Paragraph("Primary Tech Stack:", meta_label), Paragraph("MERN Stack, Tailwind CSS, REST APIs, JWT, bcrypt", meta_val),
         Paragraph("Candidate / Guide:", meta_label), Paragraph("Student: Vikash Kumar | Guide: Project Supervisor", meta_val)],
    ]
    meta_table = Table(meta_data, colWidths=[1.1*inch, 2.7*inch, 1.1*inch, 2.2*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), table_bg),
        ('BOX', (0,0), (-1,-1), 0.8, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.4, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # --- 1. ABSTRACT ---
    story.append(Paragraph("1. ABSTRACT", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    abstract_text = (
        "<b>GiftKart</b> is a modern, production-style, multi-vendor e-commerce web application engineered to "
        "bridge the gap between conventional commodity online marketplaces and specialized occasion-driven gifting. "
        "While standard e-commerce giants prioritize volume and generic logistics, they overlook critical nuances of gifting: "
        "bespoke laser engraving, custom handwritten calligraphy cards, luxury packaging (velvet boxes, floral wraps, wooden crates), "
        "target delivery date alignment for milestones, and dedicated recipient-based discovery. "
        "GiftKart resolves these challenges through a high-performance MERN (MongoDB, Express.js, React.js, Node.js) architecture. "
        "The system incorporates three synchronized portals: an interactive <b>Customer Storefront &amp; Gifting Studio</b>, a dedicated "
        "<b>Multi-Vendor Seller Operations Hub</b> for merchant listing and warehouse dispatch, and an <b>Admin CMS</b> for fleet logistics, "
        "catalog curation, and delivery milestone orchestration. The platform features 100% Indian localization with standard Rupee "
        "(₹ INR) pricing, pincode SLA delivery estimation across Indian states, realistic simulated multi-channel payments (UPI QR, RuPay, "
        "Net Banking, COD), and printable GST-compliant tax invoices."
    )
    story.append(Paragraph(abstract_text, body_style))

    # --- 2. PROBLEM STATEMENT ---
    story.append(Paragraph("2. PROBLEM STATEMENT &amp; MOTIVATION", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    problem_text = (
        "Modern online consumers face notable limitations when attempting to purchase and deliver commemorative gifts on generic retail platforms: "
        "<br/><b>1. Absence of Occasion-Specific Filtering:</b> Existing marketplaces treat gifts as standard retail SKU items, forcing users "
        "to manually sift through hundreds of irrelevant product listings without intuitive filters for Birthdays, Anniversaries, Weddings, or Festivals. "
        "<br/><b>2. Missing Emotional Personalization:</b> Mainstream platforms fail to provide real-time interactive previews for custom laser "
        "engravings, uploaded photo plaques, or handwritten greeting notes prior to checkout. "
        "<br/><b>3. Disconnect Between Sellers and Gifting Logistics:</b> Merchants lack unified dispatch workflows that generate consolidated "
        "gift-fulfillment packing slips and synchronized carrier AWB tracking numbers for time-sensitive surprise deliveries. "
        "<br/><b>4. High Complexity &amp; Third-Party Lock-In:</b> Many specialized boutique gifting platforms rely on expensive proprietary SaaS "
        "solutions, making them inaccessible for local artisans and Indian sellers seeking transparent marketplace onboarding."
    )
    story.append(Paragraph(problem_text, body_style))

    # --- 3. OBJECTIVES OF THE PROJECT ---
    story.append(Paragraph("3. PROJECT OBJECTIVES", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    objectives_text = (
        "The core technical and functional objectives of the GiftKart project are: "
        "<br/>&bull; <b>Architect a Scalable MERN Web Platform:</b> Develop a robust, decoupled 3-tier architecture with React.js frontend, "
        "Express/Node.js RESTful API backend, and MongoDB document persistence. "
        "<br/>&bull; <b>Design a Dedicated Gifting Studio:</b> Construct an exclusive <code>/gifts</code> hub featuring a 3-step Smart Gift Finder "
        "Wizard (Occasion &rarr; Recipient &rarr; Budget in ₹ INR) that delivers instantaneous client-side and server-side matching. "
        "<br/>&bull; <b>Implement Role-Based Access Control (RBAC):</b> Provide secure JWT-based authentication for three distinct user roles: "
        "Buyers, Verified Sellers, and Platform Administrators with protected API routes. "
        "<br/>&bull; <b>Empower Multi-Vendor Marketplace Operations:</b> Enable merchants to onboard via an Indian GSTIN-validated portal, manage "
        "product catalogs (selling prices, MRPs, specifications, stock levels), and print warehouse fulfillment packing slips. "
        "<br/>&bull; <b>Simulate Real-World Indian Logistics &amp; Payments:</b> Deliver an Ekart/BlueDart/Delhivery tracking simulator with "
        "public AWB lookup (<code>/track</code>), postal pincode delivery estimation, dynamic UPI QR scan-to-pay, card authorization, and GST invoices."
    )
    story.append(Paragraph(objectives_text, body_style))

    # --- 4. EXISTING VS PROPOSED SYSTEM ---
    story.append(Paragraph("4. COMPARATIVE ANALYSIS: EXISTING VS. PROPOSED SYSTEM", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    
    comp_data = [
        [Paragraph("Feature / Capability", table_header_style), 
         Paragraph("Existing Generic Marketplaces", table_header_style), 
         Paragraph("GiftKart Proposed Solution", table_header_style)],
        
        [Paragraph("Gifting Focus", table_cell_bold),
         Paragraph("Generic retail catalog; gifts mixed with general groceries/appliances.", table_cell_style),
         Paragraph("Dedicated Gifting Studio (<code>/gifts</code>) exclusively for milestone celebrations.", table_cell_style)],
        
        [Paragraph("Occasion Discovery", table_cell_bold),
         Paragraph("Manual keyword searches; no guided recommendation engine.", table_cell_style),
         Paragraph("Interactive 3-Step Smart Finder (Birthday, Anniversary, Wedding, Festive).", table_cell_style)],

        [Paragraph("Gift Customization", table_cell_bold),
         Paragraph("Very rare; requires contacting third-party sellers off-platform.", table_cell_style),
         Paragraph("Integrated engraving text, photo upload preview, handwritten card notes.", table_cell_style)],

        [Paragraph("Packaging Selection", table_cell_bold),
         Paragraph("Standard brown corrugated cardboard box.", table_cell_style),
         Paragraph("Luxury Velvet Box, Floral Wrap &amp; Wax Seal, Handcrafted Wooden Crate.", table_cell_style)],

        [Paragraph("Seller Dispatch", table_cell_bold),
         Paragraph("Opaque enterprise portals with heavy licensing fees.", table_cell_style),
         Paragraph("Streamlined Seller Hub with 1-click warehouse packing slips and AWB assignment.", table_cell_style)],

        [Paragraph("Currency &amp; Logistics", table_cell_bold),
         Paragraph("Fragmented currency switchers and third-party tracking links.", table_cell_style),
         Paragraph("Standard Indian Rupee (₹ INR), Pincode checker, Ekart/BlueDart AWB milestones.", table_cell_style)],
    ]
    comp_table = Table(comp_data, colWidths=[1.5*inch, 2.7*inch, 2.9*inch])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), header_bg),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, table_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 8))

    # --- 5. SYSTEM ARCHITECTURE & TECH STACK ---
    story.append(Paragraph("5. SYSTEM ARCHITECTURE &amp; TECHNOLOGY STACK", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    arch_intro = (
        "GiftKart is implemented as a 3-tier decoupled architecture separating presentation, business logic, and persistence layers. "
        "Communication between layers is conducted strictly via stateless JSON RESTful APIs over HTTP/HTTPS."
    )
    story.append(Paragraph(arch_intro, body_style))

    tech_data = [
        [Paragraph("Architecture Layer", table_header_style),
         Paragraph("Technology / Library", table_header_style),
         Paragraph("Role &amp; Academic Justification", table_header_style)],

        [Paragraph("Frontend (Client)", table_cell_bold),
         Paragraph("React.js (v19) + Vite + Tailwind CSS", table_cell_style),
         Paragraph("Component-based reactive UI, client-side routing via React Router DOM, dynamic utility-first responsive layout styling.", table_cell_style)],

        [Paragraph("State &amp; Networking", table_cell_bold),
         Paragraph("React Context API + Axios", table_cell_style),
         Paragraph("Centralized auth and cart management across components without heavy external state libraries; intercepted REST requests.", table_cell_style)],

        [Paragraph("Backend (Server)", table_cell_bold),
         Paragraph("Node.js + Express.js", table_cell_style),
         Paragraph("Asynchronous, non-blocking I/O event-driven web server hosting secure REST controllers, routing middleware, and data validators.", table_cell_style)],

        [Paragraph("Authentication", table_cell_bold),
         Paragraph("JSON Web Tokens (JWT) + bcrypt.js", table_cell_style),
         Paragraph("Stateless identity verification with cryptographic signature; salt-hashed secure password storage meeting OWASP guidelines.", table_cell_style)],

        [Paragraph("Database (Storage)", table_cell_bold),
         Paragraph("MongoDB + Mongoose ODM", table_cell_style),
         Paragraph("NoSQL schema-flexible document store optimizing rich nested product options, occasion arrays, order milestones, and seller data.", table_cell_style)],
    ]
    tech_table = Table(tech_data, colWidths=[1.5*inch, 2.2*inch, 3.4*inch])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), header_bg),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, table_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 8))

    # --- 6. CORE FUNCTIONAL MODULES ---
    story.append(Paragraph("6. CORE FUNCTIONAL MODULES", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    
    modules_text = (
        "<b>1. User Identity &amp; Role-Based Security:</b> Provides self-service registration and login. Supports role privileges "
        "(<code>customer</code>, <code>seller</code>, <code>admin</code>) using authorization middleware that checks JWT payload headers. "
        "<br/><b>2. Dedicated Gifting Studio &amp; Smart Finder (<code>/gifts</code>):</b> An exclusive discovery engine featuring Birthday Specials, "
        "Anniversary Keepsakes, Wedding Gifts, and Diwali Hampers. Features a 3-step interactive wizard filtering by Occasion, Recipient, and Budget in ₹ INR. "
        "<br/><b>3. Multi-Vendor Seller Operations Hub (<code>/seller/*</code>):</b> Allows Indian sellers to register with a 15-character GSTIN, "
        "manage live catalog inventory, configure selling prices vs MRPs, track order dispatch queues, and print Flipkart-style warehouse packing slips. "
        "<br/><b>4. Customization &amp; Luxury Packaging Engine:</b> Allows buyers to configure personalized laser engraving text, recipient names, "
        "photo plaque previews, handwritten greeting card notes, and gift wrapping options (Kraft box, Floral Wrap, Royal Velvet, Wooden Crate). "
        "<br/><b>5. Indian Logistics &amp; Fast-Track AWB Tracking (<code>/track</code>):</b> Integrated 6-digit Indian PIN code delivery SLA estimator "
        "(Bangalore, Mumbai, Delhi, Chennai, Kolkata), live transit timeline simulator for Ekart Logistics, BlueDart, Delhivery, and DTDC. "
        "<br/><b>6. Multi-Channel Indian Payment Gateway:</b> Simulated multi-method checkout supporting instant UPI QR scan &amp; pay (GPay, PhonePe, Paytm), "
        "RuPay/Visa cards with 3DS OTP verification, Indian Net Banking (SBI, HDFC, ICICI, Axis), and Cash on Delivery (COD). "
        "<br/><b>7. Admin CMS &amp; Operations Portal (<code>/admin/*</code>):</b> Full management of system categories, catalog products, "
        "buyer orders, delivery fleet assignments, status transitions, and GST-compliant printable tax invoices."
    )
    story.append(Paragraph(modules_text, body_style))

    # --- 7. DATABASE SCHEMA DESIGN ---
    story.append(Paragraph("7. DATABASE SCHEMA DESIGN", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    
    schema_data = [
        [Paragraph("Entity / Collection", table_header_style),
         Paragraph("Key Attributes &amp; Schema Types", table_header_style),
         Paragraph("Relationships &amp; Constraints", table_header_style)],

        [Paragraph("User", table_cell_bold),
         Paragraph("<code>name, email, passwordHash, role, sellerProfile: {storeName, gstin, phone, address}</code>", table_cell_style),
         Paragraph("Primary identity record; referenced by Product (seller) and Order (customer).", table_cell_style)],

        [Paragraph("Product", table_cell_bold),
         Paragraph("<code>name, category, price, mrp, stock, images, occasion, recipient, isGift, isAssured, seller</code>", table_cell_style),
         Paragraph("Belongs to Category and User (seller). Indexed on name and description for text searches.", table_cell_style)],

        [Paragraph("Order", table_cell_bold),
         Paragraph("<code>user, items[], customization: {engraving, giftBox, greetingCard}, totalAmount, payment, tracking</code>", table_cell_style),
         Paragraph("Belongs to User (customer); embeds shipping address, carrier AWB, and milestone timeline.", table_cell_style)],

        [Paragraph("Category", table_cell_bold),
         Paragraph("<code>name, slug, description, image, isActive</code>", table_cell_style),
         Paragraph("Referenced by Product; drives marketplace and gifting catalog taxonomy.", table_cell_style)],
    ]
    schema_table = Table(schema_data, colWidths=[1.4*inch, 3.1*inch, 2.6*inch])
    schema_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), header_bg),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, table_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(schema_table)
    story.append(Spacer(1, 8))

    # --- 8. HARDWARE & SOFTWARE REQUIREMENTS ---
    story.append(Paragraph("8. HARDWARE &amp; SOFTWARE REQUIREMENTS", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    
    req_data = [
        [Paragraph("Category", table_header_style), Paragraph("Minimum Requirement", table_header_style), Paragraph("Recommended Environment", table_header_style)],
        [Paragraph("Operating System", table_cell_bold), Paragraph("Windows 10 / Ubuntu 20.04 / macOS 12", table_cell_style), Paragraph("Windows 11 / Ubuntu 22.04 LTS (64-bit)", table_cell_style)],
        [Paragraph("Processor", table_cell_bold), Paragraph("Dual-Core 2.0 GHz Intel / AMD", table_cell_style), Paragraph("Quad-Core Intel i5 / AMD Ryzen 5 or higher", table_cell_style)],
        [Paragraph("RAM", table_cell_bold), Paragraph("4 GB RAM", table_cell_style), Paragraph("8 GB – 16 GB DDR4/DDR5", table_cell_style)],
        [Paragraph("Storage", table_cell_bold), Paragraph("10 GB Free Storage Space", table_cell_style), Paragraph("SSD with 25 GB+ Free Space", table_cell_style)],
        [Paragraph("Runtime &amp; Server", table_cell_bold), Paragraph("Node.js v18.x, npm v9.x", table_cell_style), Paragraph("Node.js v20+ LTS, npm v10+", table_cell_style)],
        [Paragraph("Database Server", table_cell_bold), Paragraph("MongoDB Community Server v6.0+", table_cell_style), Paragraph("MongoDB Community v7.0+ / Atlas Cloud", table_cell_style)],
        [Paragraph("Web Browser", table_cell_bold), Paragraph("Chrome / Edge / Firefox (HTML5 compatible)", table_cell_style), Paragraph("Latest Google Chrome / Microsoft Edge", table_cell_style)],
    ]
    req_table = Table(req_data, colWidths=[1.5*inch, 2.8*inch, 2.8*inch])
    req_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), header_bg),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, table_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(req_table)
    story.append(Spacer(1, 8))

    # --- 9. TESTING & VALIDATION METHODOLOGY ---
    story.append(Paragraph("9. TESTING &amp; VERIFICATION METHODOLOGY", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    testing_text = (
        "<b>1. Unit &amp; Component Verification:</b> Frontend React modules and UI subcomponents were verified for clean rendering "
        "and zero compiler warnings using Vite production builds (<code>npm run build</code>, 1697 modules transformed with zero errors). "
        "<br/><b>2. RESTful API Integration Testing:</b> Developed comprehensive automated integration test suites validating user registration, "
        "seller GSTIN onboarding, product creation, catalog retrieval, cart persistence, order creation in ₹ INR, and public AWB tracking lookups. "
        "<br/><b>3. Security &amp; RBAC Validation:</b> Enforced and tested JWT authentication filters preventing unauthorized access to protected "
        "seller dashboard routes and administrative endpoints. Password hashes were verified using 10 bcrypt salt rounds. "
        "<br/><b>4. Data Integrity &amp; Currency Validation:</b> Verified strict Indian Rupee (₹ INR) localization, mathematical accuracy of "
        "MRP strike-through percentage discounts, packaging cost additions, and GST tax invoice breakdowns."
    )
    story.append(Paragraph(testing_text, body_style))

    # --- 10. FUTURE SCOPE & ENHANCEMENTS ---
    story.append(Paragraph("10. FUTURE ENHANCEMENTS", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    future_text = (
        "&bull; <b>Automated Milestone Reminders:</b> Recurring calendar notifications for user birthdays and anniversaries via web push notifications. "
        "<br/>&bull; <b>Augmented Reality (AR) Gift Preview:</b> In-browser WebXR preview allowing customers to project custom engraved items "
        "and bouquets on their physical table before placing orders. "
        "<br/>&bull; <b>Multi-Lingual Regional Support:</b> Expanding UI internationalization into Hindi, Tamil, Telugu, and Bengali to broaden "
        "accessibility across Tier-2 and Tier-3 Indian cities."
    )
    story.append(Paragraph(future_text, body_style))

    # --- 11. CONCLUSION ---
    story.append(Paragraph("11. CONCLUSION", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=6))
    conclusion_text = (
        "The <b>GiftKart</b> project successfully demonstrates the design and engineering of a full-stack, enterprise-grade e-commerce application "
        "tailored specifically to the multi-vendor Indian gifting ecosystem. By combining a dedicated celebration Gifting Studio, a Flipkart-style "
        "merchant operations portal, realistic simulated Indian logistics and payment workflows, and strict Rupee localization, GiftKart "
        "surpasses standard academic demonstration projects and serves as an industry-ready final year engineering capstone. "
        "All code is structured following modern modular patterns, documented, and published to the Git repository for evaluation."
    )
    story.append(Paragraph(conclusion_text, body_style))
    story.append(Spacer(1, 14))

    # Signature Block
    sig_data = [
        [Paragraph("<b>Candidate's Signature:</b>", meta_label), Paragraph("<b>Project Guide's Signature:</b>", meta_label), Paragraph("<b>Head of Department (CSE/IT):</b>", meta_label)],
        [Spacer(1, 24), Spacer(1, 24), Spacer(1, 24)],
        [Paragraph("Date: ________________________", meta_val), Paragraph("Date: ________________________", meta_val), Paragraph("Date: ________________________", meta_val)],
    ]
    sig_table = Table(sig_data, colWidths=[2.3*inch, 2.5*inch, 2.3*inch])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(KeepTogether(sig_table))

    # Build Document with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Synopsis PDF successfully generated at: {output_filename}")


if __name__ == '__main__':
    pdf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'Project_Synopsis_GiftKart.pdf'))
    create_synopsis_pdf(pdf_path)
