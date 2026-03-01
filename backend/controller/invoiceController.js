import Invoice from "../model/invoice.js";

/* ================= CREATE INVOICE ================= */
export const createInvoice = async (req, res) => {
    try {
        const { resource, event, items, tax, dueDate } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Invoice items required" });
        }

        // Calculate totals automatically
        const calculatedItems = items.map(item => ({
            ...item,
            total: item.quantity * item.unitPrice
        }));

        const subtotal = calculatedItems.reduce(
            (acc, item) => acc + item.total,
            0
        );

        const totalAmount = subtotal + (tax || 0);

        const newInvoice = new Invoice({
            user: req.user.id,
            resource,
            event,
            items: calculatedItems,
            subtotal,
            tax,
            totalAmount,
            dueDate
        });

        await newInvoice.save();

        res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            data: newInvoice
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= GET USER INVOICES ================= */
export const getUserInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id })
            .populate("resource")
            .populate("event");

        res.json({ success: true, count: invoices.length, data: invoices });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= GET SINGLE INVOICE ================= */
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate("resource")
            .populate("event");

        if (!invoice)
            return res.status(404).json({ message: "Invoice not found" });

        res.json({ success: true, data: invoice });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= UPDATE STATUS ================= */
export const updateInvoiceStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const invoice = await Invoice.findById(req.params.id);

        if (!invoice)
            return res.status(404).json({ message: "Invoice not found" });

        invoice.status = status;

        await invoice.save();

        res.json({ success: true, message: "Status updated", data: invoice });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= DELETE INVOICE ================= */
export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice)
            return res.status(404).json({ message: "Invoice not found" });

        await invoice.deleteOne();

        res.json({ success: true, message: "Invoice deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};